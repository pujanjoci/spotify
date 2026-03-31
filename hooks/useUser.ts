"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CACHE_KEYS } from "@/lib/cache-keys";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const PROFILE_TTL = 10 * 60 * 1000; // 10 minutes

function readProfileCache(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEYS.USER_PROFILE);
    if (!raw) return null;
    const entry: CacheEntry<Profile> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > entry.ttl) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeProfileCache(profile: Profile): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry<Profile> = {
      data: profile,
      timestamp: Date.now(),
      ttl: PROFILE_TTL,
    };
    localStorage.setItem(CACHE_KEYS.USER_PROFILE, JSON.stringify(entry));
  } catch {}
}

interface UseUserReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  /** Call after a profile update so the cache is invalidated immediately. */
  refreshProfile: () => Promise<void>;
}

/**
 * Centralised hook for user identity + profile.
 *
 * - User object comes from Supabase auth (kept in sync via onAuthStateChange).
 * - Profile is cached in localStorage for 10 minutes, so navigating between
 *   pages doesn't trigger repeated DB round-trips.
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from Supabase and update cache
  const fetchProfile = async (userId: string): Promise<void> => {
    const supabase = createClient();
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      const p = data as Profile;
      writeProfileCache(p);
      setProfile(p);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (!user) return;
    // Clear cache before re-fetching
    if (typeof window !== "undefined") {
      localStorage.removeItem(CACHE_KEYS.USER_PROFILE);
    }
    await fetchProfile(user.id);
  };

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    // Resolve current user immediately
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (!mounted) return;
      setUser(currentUser);

      if (currentUser) {
        // Try cache first, fetch in background if stale
        const cached = readProfileCache();
        if (cached) {
          setProfile(cached);
          setLoading(false);
          // Background refresh if > half TTL age
          fetchProfile(currentUser.id);
        } else {
          fetchProfile(currentUser.id).finally(() => {
            if (mounted) setLoading(false);
          });
        }
      } else {
        setLoading(false);
      }
    });

    // Keep in sync with auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const cached = readProfileCache();
        if (cached) setProfile(cached);
        fetchProfile(u.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { user, profile, loading, refreshProfile };
}

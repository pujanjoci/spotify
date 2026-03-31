"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clearAllCaches, CACHE_KEYS } from "@/lib/cache-keys";

/** Session is valid for 30 minutes of inactivity */
const SESSION_TTL_MS = 30 * 60 * 1000;

/** Show "expiring soon" warning when less than 2 minutes remain */
const WARN_THRESHOLD_MS = 2 * 60 * 1000;

/** How often we re-calculate time remaining (ms) */
const TICK_INTERVAL_MS = 1_000;

/** User activity events that reset the inactivity timer */
const ACTIVITY_EVENTS = ["click", "keydown", "mousemove", "touchstart"] as const;

export interface SessionState {
  /** Seconds remaining in the session */
  timeRemaining: number;
  /** True when < 2 minutes remain */
  isExpiringSoon: boolean;
  /** True when the session has expired */
  isExpired: boolean;
  /** Manually extend the session (resets the inactivity timer) */
  extendSession: () => void;
  /** Immediately sign out, clear all caches, and redirect to /login */
  logout: () => Promise<void>;
}

/**
 * Manages Supabase session lifetime on the client.
 *
 * - Tracks last-activity timestamp in localStorage (non-sensitive; just a
 *   Unix timestamp).
 * - Resets the timer on any user interaction.
 * - Auto-logs out after SESSION_TTL_MS of inactivity.
 * - Exposes `isExpiringSoon` so a warning UI can be shown.
 */
export function useSession(): SessionState {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(SESSION_TTL_MS / 1000);
  const [isExpired, setIsExpired] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---------- helpers ----------

  const getLastActivity = useCallback((): number => {
    if (typeof window === "undefined") return Date.now();
    const raw = localStorage.getItem(CACHE_KEYS.SESSION_LOGIN_TS);
    return raw ? Number(raw) : Date.now();
  }, []);

  const resetTimer = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CACHE_KEYS.SESSION_LOGIN_TS, String(Date.now()));
  }, []);

  const logout = useCallback(async () => {
    if (tickRef.current) clearInterval(tickRef.current);
    clearAllCaches();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  // ---------- activity listener ----------

  useEffect(() => {
    // Initialise timestamp if not yet set
    if (!localStorage.getItem(CACHE_KEYS.SESSION_LOGIN_TS)) {
      resetTimer();
    }

    const handleActivity = () => resetTimer();

    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, handleActivity, { passive: true })
    );

    return () => {
      ACTIVITY_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, handleActivity)
      );
    };
  }, [resetTimer]);

  // ---------- countdown tick ----------

  useEffect(() => {
    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - getLastActivity();
      const remaining = Math.max(0, SESSION_TTL_MS - elapsed);
      setTimeRemaining(Math.floor(remaining / 1000));

      if (remaining === 0) {
        setIsExpired(true);
        if (tickRef.current) clearInterval(tickRef.current);
        logout();
      }
    }, TICK_INTERVAL_MS);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [getLastActivity, logout]);

  // ---------- Supabase auth-state sync ----------

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        clearAllCaches();
        router.push("/login");
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        resetTimer();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, resetTimer]);

  const extendSession = useCallback(() => {
    resetTimer();
    setIsExpired(false);
  }, [resetTimer]);

  return {
    timeRemaining,
    isExpiringSoon: timeRemaining > 0 && timeRemaining <= WARN_THRESHOLD_MS / 1000,
    isExpired,
    extendSession,
    logout,
  };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

interface UseLocalCacheOptions {
  /** Time-to-live in milliseconds. Default: 5 minutes. */
  ttl?: number;
  /** Set to false to skip the initial fetch entirely. Default: true. */
  enabled?: boolean;
}

interface UseLocalCacheReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** Force a fresh fetch and update the cache. */
  reload: () => Promise<void>;
  /** Remove the cache entry and re-fetch. */
  invalidate: () => Promise<void>;
}

/**
 * Generic stale-while-revalidate hook backed by localStorage.
 *
 * Flow on mount:
 *   1. Read from localStorage — if the entry is still within TTL, serve it
 *      immediately (instant paint, zero network).
 *   2. In the background, re-fetch so the next render has fresh data.
 *      (Background revalidation only happens if the entry is > half its TTL old.)
 *
 * IMPORTANT: Do NOT pass keys that store sensitive information such as auth
 * tokens or passwords. Use this only for non-sensitive application data.
 */
export function useLocalCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseLocalCacheOptions = {}
): UseLocalCacheReturn<T> {
  const { ttl = 5 * 60 * 1000, enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  // Keep fetchFn stable across renders with a ref so we don't re-trigger effects
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  });

  const readCache = useCallback((): { data: T; fresh: boolean } | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const entry: CacheEntry<T> = JSON.parse(raw);
      const age = Date.now() - entry.timestamp;
      if (age > entry.ttl) return null; // expired
      return { data: entry.data, fresh: age < entry.ttl / 2 };
    } catch {
      return null;
    }
  }, [key]);

  const writeCache = useCallback(
    (value: T) => {
      if (typeof window === "undefined") return;
      try {
        const entry: CacheEntry<T> = {
          data: value,
          timestamp: Date.now(),
          ttl,
        };
        localStorage.setItem(key, JSON.stringify(entry));
      } catch {
        // Storage quota exceeded — silently ignore
      }
    },
    [key, ttl]
  );

  const fetchFresh = useCallback(
    async (showLoading = true): Promise<void> => {
      if (showLoading) setLoading(true);
      setError(null);
      try {
        const fresh = await fetchFnRef.current();
        writeCache(fresh);
        setData(fresh);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [writeCache]
  );

  // Initial load
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const cached = readCache();

    if (cached) {
      // Serve cached data synchronously
      setData(cached.data);
      setLoading(false);

      // Background revalidate if data is stale (> half TTL old)
      if (!cached.fresh) {
        fetchFresh(false);
      }
    } else {
      // No valid cache — fetch with loading spinner
      fetchFresh(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  const reload = useCallback(() => fetchFresh(true), [fetchFresh]);

  const invalidate = useCallback(async () => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
    await fetchFresh(true);
  }, [key, fetchFresh]);

  return { data, loading, error, reload, invalidate };
}

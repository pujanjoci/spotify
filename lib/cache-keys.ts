/**
 * Central registry of localStorage keys.
 * Never hardcode these strings anywhere else — import from here.
 * No sensitive data (auth tokens, passwords) is ever stored under these keys.
 */
export const CACHE_KEYS = {
  /** Recent / featured songs from the home page */
  SONGS: "songs_cache",
  /** User's playlists list */
  PLAYLISTS: "playlist_cache",
  /** User profile (display_name, avatar_url) */
  USER_PROFILE: "user_profile",
  /** Unix timestamp (ms) of when the current session was established */
  SESSION_LOGIN_TS: "session_login_ts",
  /** Persisted audio volume (0–1) */
  PLAYER_VOLUME: "player_volume",
} as const;

export type CacheKey = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];

/**
 * Remove every app-managed localStorage entry.
 * Call this on logout so stale data is never read by the next user on
 * the same device.
 */
export function clearAllCaches(): void {
  if (typeof window === "undefined") return;
  Object.values(CACHE_KEYS).forEach((key) => localStorage.removeItem(key));
}

import { create } from "zustand";
import { Song } from "@/types";
import { CACHE_KEYS } from "@/lib/cache-keys";

/** Read saved volume from localStorage; fall back to 0.8. */
function getPersistedVolume(): number {
  if (typeof window === "undefined") return 0.8;
  try {
    const v = localStorage.getItem(CACHE_KEYS.PLAYER_VOLUME);
    if (v === null) return 0.8;
    const n = parseFloat(v);
    return isNaN(n) ? 0.8 : Math.min(1, Math.max(0, n));
  } catch {
    return 0.8;
  }
}

interface PlayerState {
  // Current state
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  volume: number;
  progress: number; // seconds
  duration: number; // seconds

  // Actions
  playSong: (song: Song, queue?: Song[]) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  togglePlay: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  // Rehydrate volume from localStorage so it survives page refresh
  volume: getPersistedVolume(),
  progress: 0,
  duration: 0,

  playSong: (song, queue = []) => {
    const q = queue.length > 0 ? queue : [song];
    const idx = q.findIndex((s) => s.id === song.id);
    set({
      currentSong: song,
      isPlaying: true,
      queue: q,
      currentIndex: idx === -1 ? 0 : idx,
      progress: 0,
    });
  },

  pauseSong: () => set({ isPlaying: false }),

  resumeSong: () => set({ isPlaying: true }),

  togglePlay: () => {
    const { isPlaying } = get();
    set({ isPlaying: !isPlaying });
  },

  nextSong: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;
    const nextIdx = (currentIndex + 1) % queue.length;
    set({
      currentSong: queue[nextIdx],
      currentIndex: nextIdx,
      isPlaying: true,
      progress: 0,
    });
  },

  prevSong: () => {
    const { queue, currentIndex, progress } = get();
    if (queue.length === 0) return;
    // If past 3 seconds, restart current song instead
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }
    const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
    set({
      currentSong: queue[prevIdx],
      currentIndex: prevIdx,
      isPlaying: true,
      progress: 0,
    });
  },

  setVolume: (volume) => {
    // Persist volume preference to localStorage
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(CACHE_KEYS.PLAYER_VOLUME, String(volume));
      }
    } catch {}
    set({ volume });
  },

  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
}));


import { create } from "zustand";
import { Song } from "@/types";

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
  volume: 0.8,
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

  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
}));

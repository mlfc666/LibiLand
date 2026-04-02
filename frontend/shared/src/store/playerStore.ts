import { create } from 'zustand';
import type { Video } from '../types/video';

interface PlayerStore {
  currentVideo: Video | null;
  isPlaying: boolean;
  watchDuration: number;
  setCurrentVideo: (video: Video | null) => void;
  setWatchDuration: (d: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>()((set) => ({
  currentVideo: null,
  isPlaying: false,
  watchDuration: 0,
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setWatchDuration: (d) => set({ watchDuration: d }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}));

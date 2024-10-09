import { create } from 'zustand';

interface MeditationState {
  speaker: string;
  music: string;
  duration: number;
  sessionStarted: boolean;
  setSessionOptions: (speaker: string, music: string, duration: number) => void;
  startSession: () => void;
  endSession: () => void;
}

export const useStore = create<MeditationState>((set) => ({
  speaker: '',
  music: '',
  duration: 0,
  sessionStarted: false,
  setSessionOptions: (speaker, music, duration) => set({ speaker, music, duration }),
  startSession: () => set({ sessionStarted: true }),
  endSession: () => set({ sessionStarted: false, speaker: '', music: '', duration: 0 }),
}));
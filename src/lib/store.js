import { create } from 'zustand';

export const useAppStore = create((set) => ({
  useExpo: false,
  setUseExpo: (value) => set({ useExpo: value }),
  // You can add more state here later
}));

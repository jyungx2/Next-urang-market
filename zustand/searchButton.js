import { create } from "zustand";

export const useSearchStore = create((set) => ({
  isOpen: false,
  toggleSearch: () => set((state) => ({ isOpen: !state.isOpen })),
}));

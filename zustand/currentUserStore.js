import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const CurrentUserStore = (set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  resetCurrentUser: () => set({ currentUser: null }),
});

const useCurrentUserStore = create(
  persist(CurrentUserStore, {
    name: "currentUser",
    storage: createJSONStorage(() => sessionStorage),
  })
);

export default useCurrentUserStore;

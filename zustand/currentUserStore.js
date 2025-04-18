import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const CurrentUserStore = (set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  resetCurrentUser: () => set({ currentUser: null }),

  setNewLocation: (location) => {
    const user = get().currentUser;
    if (!user) return;
    set({
      currentUser: {
        ...user,
        location,
      },
    });
  },
});

const useCurrentUserStore = create(
  persist(CurrentUserStore, {
    name: "currentUser",
    storage: createJSONStorage(() => sessionStorage),
  })
);

export default useCurrentUserStore;

// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// const locationStore = (set, get) => ({
//   neighborhood: [],
//   userRecentAreas: {}, // { [userId]: ['계양구 계산동', ...] }
//   setNeighborhood: (arr) => set({ neighborhood: arr }),
//   addRecentArea: (userId, area) => {
//     const current = get().userRecentAreas[userId] || [];
//     if (current.includes(area)) return;

//     const updated = [...current, area].slice(-3);
//     set((state) => ({
//       userRecentAreas: {
//         ...state.userRecentAreas,
//         [userId]: updated,
//       },
//     }));
//   },

//   getRecentAreasByUser: (userId) => get().userRecentAreas[userId] || [],
// });

// const useLocationStore = create(
//   persist(locationStore, {
//     name: "location-neightborhood",
//     storage: createJSONStorage(() => sessionStorage),
//   })
// );

// export default useLocationStore;

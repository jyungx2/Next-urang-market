import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const CurrentUserStore = (set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  resetCurrentUser: () => set({ currentUser: null }),

  setNewLocation: (location) => {
    // const user = get().currentUser; // ⚠️ 이 값이 오래됐을 수 있음(특히 await 뒤)
    // if (!user) return;

    // Zustand는 set() 호출 시 구독자에게 알리지만,
    // 컴포넌트 리렌더 여부는 "선택자(selector)가 반환한 값"의 참조 변화(===)에 달려 있음.
    // 즉, location/recentLocations/selectedLocation 같은 중첩 필드만 변이(mutate)하면
    // parent 참조(currentUser)가 그대로라 selector 결과도 동일 → 리렌더 X.
    // 따라서 중첩 필드를 바꿀 땐, 그 필드를 포함하는 부모 객체(currentUser)까지
    // "새 참조"로 교체해야 리렌더가 트리거됨.

    // 1) 중첩 필드만 변이(push/splice 등) → ❌ (특히 immer 미사용 시 더 위험)
    // set((state) => {
    //   state.currentUser.recentLocations.push(loc); // 변이
    //   return { currentUser: state.currentUser };   // 같은 참조 → selector 결과 동일 → 리렌더 X
    // });
    // => 컴포넌트가 구독하는 조각의 참조가 반드시 새로워지도록 **스토어에서 업데이트**

    // 2. 부모까지 새 참조로 교체 → ✅
    set((state) => {
      const user = state.currentUser; // 함수형 set (권장) ✅
      if (!user) return;
      return {
        currentUser: {
          ...user,
          location,
        }, // 새 객체 참조로 교체 → selector 결과 변경 → 리렌더 O
      };
    });
  },

  setRecentLocations: (newLocations) => {
    set((state) => {
      const user = state.currentUser;
      if (!user) return;
      return {
        currentUser: {
          ...user,
          recentLocations: newLocations,
        },
      };
    });
  },

  setSelectedLocation: (selectedLocation) => {
    set((state) => {
      const user = state.currentUser;
      if (!user) return;

      return {
        currentUser: {
          ...user,
          selectedLocation,
        },
      };
    });
  },

  // setLikePost: (postArray) => {
  //   const user = get().currentUser;
  //   if (!user) return;
  //   set({
  //     currentUser: {
  //       ...user,
  //       likes: postArray,
  //     },
  //   });
  // },

  // setDislikePost: (postArray) => {
  //   const user = get().currentUser;
  //   if (!user) return;
  //   set({
  //     currentUser: {
  //       ...user,
  //       dislikes: postArray,
  //     },
  //   });
  // },
});

const useCurrentUserStore = create(
  persist(CurrentUserStore, {
    name: "currentUser",
    storage: createJSONStorage(() => sessionStorage),
  })
);

export default useCurrentUserStore;

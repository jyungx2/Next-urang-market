import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const UserStore = (set) => ({
  username: "",
  birthdate: "",
  phoneNumber: "",
  isVerified: false,
  profileImage: null,
  nickname: "",

  // ✅ 개별 setter들
  setUsername: (value) => set({ username: value }),
  setBirthdate: (value) => set({ birthdate: value }),
  setPhoneNumber: (value) => set({ phoneNumber: value }),
  setIsVerified: (value) => set({ isVerified: value }),
  setNickname: (value) => set({ nickname: value }),
  setProfileImage: (value) => set({ profileImage: value }),

  // ✅ 전체 객체로 덮어쓰기용 setUser (API 응답 등)
  // 마지막 단계에서 다 모은 user 정보를 서버에 보내기 직전엔 유용 => 필드별로 하나하나 값을 store의 상태로 덮어쓰는 것
  setUser: (user) => set({ ...user }),
  // **동작원리: zustand의 set() 함수는 내부적으로 React.useState()랑 비슷하게 동작

  // ✅ 초기화용
  resetUser: () =>
    set({
      username: "",
      birthdate: "",
      phoneNumber: "",
      isVerified: false,
      profileImage: null,
      nickname: "",
    }),
});

// 스토리지를 사용할 경우
const useUserStore = create(
  persist(UserStore, {
    name: "user",
    storage: createJSONStorage(() => sessionStorage), // 기본은 localStorage
  })
);

export default useUserStore;

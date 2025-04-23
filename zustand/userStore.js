import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ✅ 회원가입 단계 중 필요한 정보만 일시적으로 저장하는 용도
// - 회원가입 끝나고 DB에 저장했으면 → 더 이상 쓸 필요 없음!
// - 그래서 persist 붙일 필요도 X & 새로고침돼도 사라져야 정상
const UserStore = (set, get) => ({
  location: {},
  username: "",
  birthdate: "",
  phoneNumber: "",
  isVerified: false,
  profileImage: null,
  nickname: "",
  recentLocations: [],
  selectedLocation: {},

  // ✅ 개별 setter들 (회원가입 단계별 페이지에서 해당 필드만 독립적으로 업데이트할 때 필요)
  setLocation: (value) => set({ location: value }),
  setUsername: (value) => set({ username: value }),
  setBirthdate: (value) => set({ birthdate: value }),
  setPhoneNumber: (value) => set({ phoneNumber: value }),
  setIsVerified: (value) => set({ isVerified: value }),
  // 📌 마지막 단계처럼 모든 데이터를 모아 처리하는 단계에선 setUser()만 써도 OK.
  // setNickname: (value) => set({ nickname: value }),
  // setProfileImage: (value) => set({ profileImage: value }),

  // ✅ 전체 객체로 덮어쓰기용 setUser (API 응답 등)
  // 마지막 단계에서 다 모은 user 정보를 서버에 보내기 직전엔 유용 => 필드별로 하나하나 값을 store의 상태로 덮어쓰는 것
  setUser: (user) => set({ ...user }),
  // **동작원리: zustand의 set() 함수는 내부적으로 React.useState()랑 비슷하게 동작

  // ✅ 상태 값을 하나로 모아 반환해주는 유틸 함수
  // ❌ 잘못된 get 함수 사용방법
  // getUser: () =>
  //   get((state) => ({
  //     username: state.username,
  //     birthdate: state.birthdate,
  //     phoneNumber: state.phoneNumber,
  //     profileImage: state.profileImage,
  //     nickname: state.nickname,
  //   })),

  // ✅ 정석적으로 쓰는 방법
  getUser: () => {
    const state = get(); // 전체 상태를 받아와서
    return {
      location: state.location,
      username: state.username,
      birthdate: state.birthdate,
      phoneNumber: state.phoneNumber,
      profileImage: state.profileImage,
      nickname: state.nickname,
      recentLocations: state.recentLocations,
      selectedLocation: state.selectedLocation,
    };
  },

  // ✅ 회원가입 완료 시 호출할 초기화 함수
  resetUser: () =>
    set({
      location: "",
      username: "",
      birthdate: "",
      phoneNumber: "",
      isVerified: false,
      profileImage: null,
      nickname: "",
      recentLocations: [],
      selectedLocation: {},
    }),
});

// 스토리지를 사용할 경우
const useUserStore = create(
  persist(UserStore, {
    name: "signup-temp-user",
    storage: createJSONStorage(() => sessionStorage), // 기본은 localStorage
  })
);

export default useUserStore;

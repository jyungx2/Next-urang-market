import useCurrentUserStore from "@/zustand/currentUserStore";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function Settings() {
  const logout = () => {
    useCurrentUserStore.getState().resetCurrentUser();
    // 서버에 /api/auth/signout 요청을 보냄 & 브라우저의 세션 쿠키(JWT 포함)를 제거 & 기본적으로 홈페이지("/")로 리디렉트됨
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="gap-6 items-center p-6 rounded-2xl bg-[var(--color-primary-50)]">
      <h2 className="mb-6 font-bold text-[2rem]">Settings</h2>
      <div className="flex flex-col gap-6">
        <button
          className="font-medium cursor-pointer flex justify-between items-center"
          onClick={logout}
        >
          <span>로그아웃</span>
          <Image
            src="/icons/chevron-right.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>
        <button className="font-medium cursor-pointer flex justify-between items-center">
          <span>회원탈퇴</span>
          <Image
            src="/icons/chevron-right.svg"
            alt="icon"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}

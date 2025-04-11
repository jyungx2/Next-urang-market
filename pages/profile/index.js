import Layout from "@/components/layout/layout";
import Profile from "@/components/profile/profile";
import ProfileLayout from "@/pages/profile/layout";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <ProfileLayout>
      <main className="flex flex-col gap-14">
        <Profile />
        <div className="gap-6 items-center p-6 rounded-2xl bg-[var(--color-primary-50)]">
          <h2 className="mb-6 font-bold text-[2rem]">Services</h2>
          <div className="grid grid-cols-2 items-center gap-6">
            <button className="font-medium cursor-pointer flex items-center gap-4">
              <Image
                src="/icons/airplane.svg"
                alt="icon"
                width={20}
                height={20}
              />
              <span>현지거래</span>
            </button>
            <button className="font-medium cursor-pointer flex items-center gap-4">
              <Image
                src="/icons/airplane.svg"
                alt="icon"
                width={20}
                height={20}
              />
              <span>해외살이</span>
            </button>
            <button className="font-medium cursor-pointer flex items-center gap-4">
              <Image
                src="/icons/airplane.svg"
                alt="icon"
                width={20}
                height={20}
              />
              <span>워킹홀리데이</span>
            </button>
            <button className="font-medium cursor-pointer flex items-center gap-4">
              <Image
                src="/icons/airplane.svg"
                alt="icon"
                width={20}
                height={20}
              />
              <span>해외취업</span>
            </button>
          </div>
        </div>

        <div className="gap-6 items-center p-6 rounded-2xl bg-[var(--color-primary-50)]">
          <h2 className="mb-6 font-bold text-[2rem]">Activity</h2>
          <div className="flex flex-col gap-6">
            <button className="font-medium cursor-pointer flex justify-between items-center">
              <span>즐겨찾기</span>
              <Image
                src="/icons/chevron-right.svg"
                alt="icon"
                width={20}
                height={20}
              />
            </button>
            <button className="font-medium cursor-pointer flex justify-between items-center">
              <span>최근 본 상품</span>
              <Image
                src="/icons/chevron-right.svg"
                alt="icon"
                width={20}
                height={20}
              />
            </button>
            <button className="font-medium cursor-pointer flex justify-between items-center">
              <span>판매 목록</span>
              <Image
                src="/icons/chevron-right.svg"
                alt="icon"
                width={20}
                height={20}
              />
            </button>
            <button className="font-medium cursor-pointer flex justify-between items-center">
              <span>구매 내역</span>
              <Image
                src="/icons/chevron-right.svg"
                alt="icon"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>

        <div className="gap-6 items-center p-6 rounded-2xl bg-[var(--color-primary-50)]">
          <h2 className="mb-6 font-bold text-[2rem]">Settings</h2>
          <div className="flex flex-col gap-6">
            <button className="font-medium cursor-pointer flex justify-between items-center">
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
      </main>
    </ProfileLayout>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ProfilePage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>; // Layout 안 씌움
};

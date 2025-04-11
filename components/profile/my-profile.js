import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";

export default function MyProfile() {
  const { currentUser } = useCurrentUserStore();

  return (
    <div className="flex gap-6 items-center p-4 rounded-2xl bg-[var(--color-primary-50)]">
      <Image
        src={currentUser.profileImage}
        alt="profile-image"
        width={60}
        height={60}
        className="aspect-square rounded-full object-cover"
      />
      <div className="flex items-center gap-4 grow">
        <span className="font-bold text-[2.2rem]">{currentUser.nickname}</span>
        <div className="font-bold text-[1.4rem] bg-blue-400 rounded-2xl p-2 text-blue-50">
          36.5℃
        </div>
      </div>
      <button className="cursor-pointer">
        <Image
          src="/icons/chevron-right.svg"
          alt="profile-image"
          width={26}
          height={26}
        />
      </button>
    </div>
  );
}

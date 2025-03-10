import MyProfile from "@/components/profile/my-profile";
import Image from "next/image";

export default function Profile() {
  return (
    <>
      <div className="flex flex-col gap-8">
        <header className="flex justify-between items-center">
          <h1 className="font-bold text-[2.8rem]">My Profile</h1>
          <button className="cursor-pointer">
            <Image src="/icons/cog-6.svg" alt="icon" width={30} height={30} />
          </button>
        </header>
      </div>

      <MyProfile />
    </>
  );
}

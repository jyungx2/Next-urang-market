import MyProfile from "@/components/profile/my-profile";
import { useSettings } from "@/store/settings-context";
import Image from "next/image";

export default function Profile() {
  const { toggleSettings } = useSettings();

  return (
    <>
      <div className="flex flex-col gap-8">
        <header className="flex justify-between items-center">
          <h1 className="font-bold text-[2.4rem]">My Profile</h1>
          <button className="cursor-pointer" onClick={toggleSettings}>
            <Image src="/icons/cog-6.svg" alt="icon" width={30} height={30} />
          </button>
        </header>
      </div>

      <MyProfile />
    </>
  );
}

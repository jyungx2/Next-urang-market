import MyProfile from "@/components/profile/my-profile";
import UIContext from "@/store/ui-context";
import Image from "next/image";
import { useContext } from "react";

export default function Profile() {
  const { toggleSettingsPage } = useContext(UIContext);

  return (
    <>
      <div className="flex flex-col gap-8">
        <header className="flex justify-between items-center">
          <h1 className="font-bold text-[2.4rem]">My Profile</h1>
          <button className="cursor-pointer" onClick={toggleSettingsPage}>
            <Image src="/icons/cog-6.svg" alt="icon" width={30} height={30} />
          </button>
        </header>
      </div>

      <MyProfile />
    </>
  );
}

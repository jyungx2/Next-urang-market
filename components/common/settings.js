import UIContext from "@/store/ui-context";
import Image from "next/image";
import { useContext } from "react";

export default function SettingsPage() {
  const { toggleSettingsPage } = useContext(UIContext);

  return (
    <div className="h-screen flex flex-col gap-10 text-white bg-black p-6">
      <header className="flex justify-center relative border-gray-300">
        <button
          className="absolute left-0 cursor-pointer"
          onClick={toggleSettingsPage}
        >
          <Image
            src="/icons/chevron-left-w.svg"
            alt="icon"
            width={28}
            height={28}
          />
        </button>
        <h1 className="font-bold text-[2.4rem]">환경설정</h1>
      </header>
      <main className="flex flex-col gap-20">
        <div className="flex flex-col gap-6 rounded-xl">
          <h2 className="text-[1.6rem] font-bold">User Settings</h2>
          <ul className="flex flex-col gap-5">
            <li>Manage account</li>
            <li>Followed users</li>
            <li>Manage blocked users</li>
          </ul>
        </div>

        <div className="flex flex-col gap-6 rounded-xl">
          <h2 className="text-[1.6rem] font-bold">Other</h2>
          <ul className="flex flex-col gap-5">
            <li>Change country</li>
            <li>Language settings</li>
            <li>Log out</li>
            <li>Delete account</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

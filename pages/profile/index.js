import Notification from "@/components/common/notification";
import SettingsPage from "@/components/common/settings";
import Chat from "@/components/profile/chat";
import Profile from "@/components/profile/profile";
import ProfileLayout from "@/pages/profile/layout";
import UIContext from "@/store/ui-context";
import { useContext } from "react";

export default function ProfilePage() {
  const { isSettingsOpen } = useContext(UIContext);

  return (
    <div className="flex flex-col p-6 bg-[var(--color-bg)] min-h-screen">
      <main className="flex flex-col gap-14">
        {!isSettingsOpen && <Profile />}
      </main>
    </div>
  );
}

import Profile from "@/components/profile/profile";
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

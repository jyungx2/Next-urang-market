import SettingsPage from "@/components/common/settings";
import UIContext from "@/store/ui-context";
import { useContext } from "react";

export default function ProfileLayout({ children }) {
  const { isSettingsOpen } = useContext(UIContext);

  return (
    <>
      {isSettingsOpen && <SettingsPage />}
      <div className="flex flex-col p-6 bg-[var(--color-bg)]">
        <main className="flex flex-col gap-14">{children}</main>
      </div>
    </>
  );
}

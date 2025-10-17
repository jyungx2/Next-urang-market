import SettingsPage from "@/components/common/settings";
import { useSettings } from "@/store/settings-context";
import { useContext } from "react";

export default function ProfileLayout({ children }) {
  const { isSettingsOpen } = useSettings();

  return (
    <>
      {isSettingsOpen ? (
        <SettingsPage />
      ) : (
        <div className="flex flex-col p-6 bg-[var(--color-bg)] min-h-screen">
          <main className="flex flex-col gap-14">{children}</main>
        </div>
      )}
    </>
  );
}

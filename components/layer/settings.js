import React from "react";
import SettingsPage from "@/components/common/SettingsPage";
import { useSettings } from "@/store/settings-context";

export const SettingsLayer = React.memo(function SettingsLayer() {
  // const { isSettingsOpen } = useContext(SettingsContext);
  const { isSettingsOpen } = useSettings();

  if (!isSettingsOpen) return null;
  return (
    <div className="bg-black bg-opacity-50 z-40">
      <SettingsPage />
    </div>
  );
});

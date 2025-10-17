import React from "react";
import Settings from "@/components/common/settingsPage";
import { useSettings } from "@/store/settings-context";

export const SettingsLayer = React.memo(function SettingsLayer() {
  // const { isSettingsOpen } = useContext(SettingsContext);
  const { isSettingsOpen } = useSettings();

  if (!isSettingsOpen) return null;
  return (
    <div className="bg-black bg-opacity-50 z-40">
      <Settings />
    </div>
  );
});

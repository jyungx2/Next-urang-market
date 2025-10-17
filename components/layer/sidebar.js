import React from "react";
import { useSidebar } from "@/store/sidebar-context";
import Sidebar from "@/components/common/sidebar";

export const SidebarLayer = React.memo(function SidebarLayer() {
  // const { isSidebarOpen } = useContext(SidebarContext);
  const { isSidebarOpen } = useSidebar();

  if (!isSidebarOpen) return null;
  return (
    <div className="bg-black bg-opacity-50 z-40">
      <Sidebar />
    </div>
  );
});

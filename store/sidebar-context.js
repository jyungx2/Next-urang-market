import { createContext, useState } from "react";

const SidebarContext = createContext();
// {
//   isSidebarOpen: false,
//   toggleSidebar: () => {},
// }

export function SidebarContextProvider(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarOverall, setisSidebarOverall] = useState(false);

  const toggleSidebarHandler = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const coverAllHandler = () => {
    setisSidebarOverall(!isSidebarOverall);
  };

  const context = {
    isSidebarOpen,
    toggleSidebar: toggleSidebarHandler,
    isSidebarOverall,
    coverAll: coverAllHandler,
  };

  return (
    <SidebarContext.Provider value={context}>
      {props.children}
    </SidebarContext.Provider>
  );
}

export default SidebarContext;

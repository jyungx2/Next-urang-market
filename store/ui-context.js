import { createContext, useState } from "react";

const UIContext = createContext();

export function UIContextProvider(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarOverall, setisSidebarOverall] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSidebarHandler = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const coverAllHandler = () => {
    setisSidebarOverall(!isSidebarOverall);
  };

  const toggleSearchPageHandler = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const context = {
    isSidebarOpen,
    toggleSidebar: toggleSidebarHandler,
    isSidebarOverall,
    coverAll: coverAllHandler,
    isSearchOpen,
    toggleSearchPage: toggleSearchPageHandler,
  };

  return (
    <UIContext.Provider value={context}>{props.children}</UIContext.Provider>
  );
}

export default UIContext;

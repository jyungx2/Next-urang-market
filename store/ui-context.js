import { createContext, useState } from "react";

const UIContext = createContext();

export function UIContextProvider(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarOverall, setisSidebarOverall] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 사이드바
  const toggleSidebarHandler = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const coverAllHandler = () => {
    setisSidebarOverall(!isSidebarOverall);
  };

  // 검색페이지
  const toggleSearchPageHandler = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // 설정페이지
  const toggleSettingsPageHandler = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const context = {
    isSidebarOpen,
    toggleSidebar: toggleSidebarHandler,
    isSidebarOverall,
    coverAll: coverAllHandler,
    isSearchOpen,
    toggleSearchPage: toggleSearchPageHandler,
    isSettingsOpen,
    toggleSettingsPage: toggleSettingsPageHandler,
  };

  return (
    <UIContext.Provider value={context}>{props.children}</UIContext.Provider>
  );
}

export default UIContext;

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo(
    () => ({ isSidebarOpen: open, toggleSidebar: toggle }),
    [open, toggle]
  );
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

// 단순 SidebarContext 리턴하는 것이 아닌, 커스텀 훅 useSidebar (에러 핸들링) 추가
// - Provider 누락 시 명확한 에러로 바로 잡을 수 있고,
// 나중에 내부 구현(Zustand로 변경 등)을 캡슐화 가능
export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}

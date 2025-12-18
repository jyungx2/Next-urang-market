import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo(
    () => ({ isSettingsOpen: open, toggleSettings: toggle }),
    [open, toggle]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  // 현재 렌더링 중인 컴포넌트 기준으로 상위 트리에서 가장 가까운 <SomeContext.Provider>의 value를 가져옴
  if (!ctx)
    throw new Error("useSettings must be used within <SettingsProvider>");
  return ctx;
}

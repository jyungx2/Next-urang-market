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
  if (!ctx)
    throw new Error("useSettings must be used within <SettingsProvider>");
  return ctx;
}

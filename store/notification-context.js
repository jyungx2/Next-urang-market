import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo(
    () => ({ isNotificationOpen: open, toggleNotification: toggle }),
    [open, toggle]
  );
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotification must be used within <NotificationProvider>"
    );
  return ctx;
}

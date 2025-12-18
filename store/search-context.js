import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo(
    () => ({ isSearchOpen: open, toggleSearch: toggle }),
    [open, toggle]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>");
  return ctx;
}

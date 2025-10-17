import React from "react";
import { useSearch } from "@/store/search-context";
import SearchPage from "@/components/common/searchPage";

export const SearchLayer = React.memo(function SearchLayer() {
  // const { isSearchOpen } = useContext(SearchContext);
  const { isSearchOpen } = useSearch();

  if (!isSearchOpen) return null;
  return (
    <div className="bg-black bg-opacity-50 z-40">
      <SearchPage />
    </div>
  );
});

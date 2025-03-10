import { createContext, useState } from "react";

const SearchPageContext = createContext();

export function SearchPageContextProvider(props) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearchPageHandler = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const context = {
    isSearchOpen,
    toggleSearchPage: toggleSearchPageHandler,
  };

  return (
    <SearchPageContext.Provider value={context}>
      {props.children}
    </SearchPageContext.Provider>
  );
}

export default SearchPageContext;

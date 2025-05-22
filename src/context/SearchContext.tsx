
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SearchContextType = {
  globalSearch: string;
  setGlobalSearch: (value: string) => void;
};

const SearchContext = createContext<SearchContextType>({
  globalSearch: '',
  setGlobalSearch: () => {},
});

export function SearchProvider({ children }: { children: ReactNode }) {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <SearchContext.Provider value={{ globalSearch, setGlobalSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);

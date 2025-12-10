"use client";

import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
}

const SearchBar = ({ query, setQuery }: SearchBarProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-[35vw] relative">
      <input
        type="text"
        placeholder="What are you searching for..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-4 rounded-md bg-decor-beige-100 border-2 border-black text-black text-2xl focus:border-decor-olive-600 focus:outline-none"
      />
      <FaSearch className="absolute left-[93%] text-black text-3xl" />
    </div>
  );
};

export default SearchBar;

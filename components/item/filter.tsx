"use client";

import { useState, useRef, useEffect } from "react";

interface FilterProps {
  onFilterChange: (category: string | null) => void;
  categories: string[];
  selected: string | null;
}

const Filter = ({ onFilterChange, categories, selected }: FilterProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (category: string) => {
    const value = category === selected ? null : category;
    onFilterChange(value);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-8 py-2 rounded bg-decor-olive-600 text-white hover:bg-decor-olive-400 text-5xl"
      >
        Filter {selected ? `: ${selected}` : ""}
      </button>

      {open && (
        <div className="absolute mt-2 w-48 bg-decor-olive-600 border shadow-md rounded z-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleChange(category)}
              className={`block w-full text-left px-4 py-2 hover:bg-decor-olive-400 ${
                selected === category ? "font-bold bg-decor-olive-300" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;

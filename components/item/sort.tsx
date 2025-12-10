"use client";

import { useState, useRef, useEffect } from "react";

interface SortProps {
  onSortChange: (order: "asc" | "desc" | null) => void;
  currentSort: "asc" | "desc" | null;
}

const Sort = ({ onSortChange, currentSort }: SortProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSort = (order: "asc" | "desc" | null) => {
    onSortChange(order);
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

  const buttonLabel =
    currentSort === "asc"
      ? "Price: Low → High"
      : currentSort === "desc"
        ? "Price: High → Low"
        : "Sort";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-8 py-2 rounded bg-decor-olive-600 text-white hover:bg-decor-olive-400 text-5xl"
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="absolute mt-2 w-48 bg-decor-olive-600 border shadow-md rounded z-10">
          <button
            className={`block w-full text-left px-4 py-2 hover:bg-decor-olive-400 ${
              currentSort === "asc" ? "font-bold bg-decor-olive-300" : ""
            }`}
            onClick={() => handleSort("asc")}
          >
            Price: Low → High
          </button>
          <button
            className={`block w-full text-left px-4 py-2 hover:bg-decor-olive-400 ${
              currentSort === "desc" ? "font-bold bg-decor-olive-300" : ""
            }`}
            onClick={() => handleSort("desc")}
          >
            Price: High → Low
          </button>
          <button
            className={`block w-full text-left px-4 py-2 hover:bg-decor-olive-400 ${
              currentSort === null ? "font-bold bg-decor-olive-300" : ""
            }`}
            onClick={() => handleSort(null)}
          >
            Clear Sort
          </button>
        </div>
      )}
    </div>
  );
};

export default Sort;

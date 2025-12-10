"use client";

import { useState, useEffect } from "react";
import Item from "./item";
import Filter from "./filter";
import Sort from "./sort";
import SearchBar from "../searchbar";

interface ItemProps {
  id: string;
  name: string;
  price: string;
  image_url: string | null;
  tags: string[];
}

const ItemsPage = () => {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  // Fetch all tags
  useEffect(() => {
    const fetchTags = async () => {
      const res = await fetch("/api/admin/tags");
      const data = await res.json();
      setTags(data.map((tag: any) => tag.name));
    };
    fetchTags();
  }, []);

  // Fetch all items
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      let url = "/api/item/items"; // you can also use a filter API if needed
      if (selectedTag) url = `/api/item/filtertag?tag=${selectedTag}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(data || []);
      setLoading(false);
    };
    fetchItems();
  }, [selectedTag]);

  // Apply search and sort
  const processedItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortOrder) return 0;
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

  if (loading)
    return <p className="text-center text-black text-5xl p-5">Loading...</p>;

  return (
    <div className="flex flex-col items-center p-5">
      <div className="flex gap-3 mb-5">
        <SearchBar query={searchQuery} setQuery={setSearchQuery} />
        <Filter
          categories={tags}
          selected={selectedTag}
          onFilterChange={setSelectedTag}
        />
        <Sort onSortChange={setSortOrder} currentSort={sortOrder} />
      </div>

      <div className="w-full grid grid-cols-3 gap-5">
        {processedItems.length !== 0 ? (
          processedItems.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              url={item.image_url}
            />
          ))
        ) : (
          <p className="text-center text-black text-5xl p-5 col-span-3">
            No items found for &quot;{searchQuery}&quot;
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemsPage;

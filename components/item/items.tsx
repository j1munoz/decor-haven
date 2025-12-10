"use client";

import { useState, useEffect } from "react";
import Item from "./item";
import Filter from "./filter";
import Sort from "./sort";

interface ItemProps {
  id: string;
  name: string;
  price: string;
  image_url: string | null;
  tags: string[];
}

const Items = () => {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      const res = await fetch("/api/admin/tags");
      const data = await res.json();
      setTags(data || []);
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      let url = "/api/item/filtertag";
      if (selectedTag) url += `?tag=${selectedTag}`;

      const res = await fetch(url);
      const data = await res.json();
      setItems(data || []);
      setLoading(false);
    };

    fetchItems();
  }, [selectedTag]);

  const sortedItems = [...items];
  if (sortOrder === "asc") {
    sortedItems.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    sortedItems.sort((a, b) => b.price - a.price);
  }

  if (loading)
    return <p className="text-center text-black text-5xl p-5">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center p-5 space-y-5">
      <div className="flex gap-5 items-center">
        <Filter
          categories={tags.map((tag) => tag.name)}
          onFilterChange={setSelectedTag}
          selected={selectedTag}
        />
        <Sort onSortChange={setSortOrder} />
      </div>
      <div className="w-full grid grid-cols-3 gap-5">
        {sortedItems.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            url={item.image_url}
          />
        ))}
      </div>
    </div>
  );
};

export default Items;

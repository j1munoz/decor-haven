"use client";

import { useState, useEffect } from "react";
import Item from "./item";

interface ItemProps {
  id: string;
  name: string;
  price: string;
  image_url: string | null;
}

const Items = () => {
  const [items, setItems] = useState<ItemProps[] | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("/api/item/items");
      const data = await res.json();
      setItems(data);
    };

    fetchItems();
  }, []);

  // Render nothing (or a loading indicator) until items are loaded
  if (!items)
    return <p className="text-center text-black text-5xl p-5">Loading...</p>;

  return (
    <div className="w-full grid grid-cols-3 gap-5">
      {items.map((item) => (
        <Item
          key={item.id}
          id={item.id}
          name={item.name}
          price={item.price}
          url={item.image_url}
        />
      ))}
    </div>
  );
};

export default Items;

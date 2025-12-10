"use client";

import { use } from "react";
import { useEffect, useState } from "react";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export default function ItemPage({ params }: ItemPageProps) {
  const { id } = use(params);
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/item/${id}`);
      const data = await res.json();
      console.log(data);
      setItem(data);
    };

    fetchItem();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-black">Item Page for ID: {id}</h1>
    </div>
  );
}

"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import DateRangePicker from "@/components/item/datepicker";

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
    <div className="flex flex-col items-center justify-center gap-5">
      <h1 className="text-black">Item Page for ID: {id}</h1>
      <DateRangePicker id={id} stock={item?.stock as number | -5} />
    </div>
  );
}

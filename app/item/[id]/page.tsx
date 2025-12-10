"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import DateRangePicker from "@/components/item/datepicker";
import { ItemCard } from "@/components/item/itemcard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      setItem(data);
    };

    fetchItem();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center gap-10 mt-5">
      <ItemCard
        url={item?.image_urls[0]}
        title={item?.name}
        price={item?.price}
        description={item?.description || ""}
      />
      <Accordion
        type="single"
        collapsible
        className="w-2/3"
        defaultValue="item-details"
      >
        <AccordionItem value="item-details">
          <AccordionTrigger className="text-2xl font-semibold text-black px-4 py-2">
            Item Details
          </AccordionTrigger>
          <AccordionContent className="bg-decor-olive-50 px-4 py-2">
            <ul className="list-disc list-inside text-lg text-gray-800">
              {item?.included.map((point: string, index: number) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="category">
          <AccordionTrigger className="text-2xl font-semibold text-black px-4 py-2">
            Category
          </AccordionTrigger>
          <AccordionContent className="bg-decor-olive-50 px-4 py-2">
            <ul className="list-disc list-inside text-lg text-gray-800">
              {item?.tags.map((tag: string, index: number) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <DateRangePicker id={id} stock={item?.stock as number | -5} />
    </div>
  );
}

import * as React from "react";
import Image from "next/image";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface ItemCardProps {
  url: string;
  title: string;
  price: string;
  description: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  url,
  title,
  price,
  description,
}) => {
  console.log("ItemCard props:", { url, title, price, description });
  return (
    // image part
    <Card className="flex flex-row p-4 w-4/5 mx-auto bg-decor-beige-100 border-0 shadow-xl">
      <div className="w-1/3 min-w-[200px] aspect-[4/3] mr-6 rounded-lg overflow-hidden">
        <img
          src={url}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      {/* text part with title, price, description*/}
      <div className="flex flex-col w-2/3">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-5xl font-bold text-decor-olive-600">
            {title}
          </CardTitle>
          <CardDescription className="text-3xl text-decor-olive-400 font-medium mt-1">
            ${price}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-2">
          <p className="text-xl text-gray-700 leading-relaxed">{description}</p>
        </CardContent>
      </div>
    </Card>
  );
};

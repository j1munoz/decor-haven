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
  return (
    // image part
    <Card className="flex flex-row p-4 max-w-4xl mx-auto">
      <div className="relative w-1/3 min-w-[200px] aspect-[4/3] mr-6 rounded-lg overflow-hidden">
        <Image
          src={url}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>

      {/* text part with title, price, description*/}
      <div className="flex flex-col w-2/3">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
          <CardDescription className="text-xl text-foreground font-medium mt-1">
            {price}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-2">
          <p className="text-base text-gray-700 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </div>
    </Card>
  );
};
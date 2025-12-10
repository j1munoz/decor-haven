"use client";

import { FaTrash } from "react-icons/fa";
import { removeFromCart, getCart } from "@/utils/cart";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface CartItemProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
  startDate: string;
  endDate: string;
  onRemove?: () => void;
  status: string;
}

export default function CartItem({
  product,
  startDate,
  endDate,
  onRemove,
  status,
}: CartItemProps) {
  const handleDelete = () => {
    removeFromCart(product.id, startDate, endDate);
    toast.success("Item removed from cart");
    if (onRemove) onRemove();
  };

  return (
    <div className="bg-decor-olive-600 p-4 rounded-xl shadow-xl mb-3 flex gap-4 relative w-5/6 text-white">
      <div className="flex flex-col justify-between gap-3">
        <h2 className="text-5xl font-bold">{product.name}</h2>
        <p className="text-3xl">Price: ${product.price}</p>
        <p className="text-xl text-gray-300">
          Rental: <strong>{startDate}</strong> → <strong>{endDate}</strong>
        </p>
      </div>

      {status === "cart" ? (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-white hover:text-red-800"
        >
          <FaTrash size={24} />
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}

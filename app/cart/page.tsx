"use client";

import { useEffect, useState } from "react";
import { getCart } from "@/utils/cart";
import { toast } from "react-hot-toast";
import CartItem from "@/components/cart/item";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
}

interface CartItem {
  itemId: string;
  startDate: string;
  endDate: string;
  product?: Product;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      const cart = getCart();
      if (!cart || cart.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const ids = cart.map((c) => c.itemId);

      try {
        const res = await fetch("/api/item/byIds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }

        const productData: Product[] = await res.json();

        const merged = cart.map((cartItem) => ({
          ...cartItem,
          product: productData.find((p) => p.id === cartItem.itemId),
        }));

        setItems(merged);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cart items.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  if (loading)
    return <p className="text-center text-black text-5xl p-5">Loading...</p>;

  if (items.length === 0)
    return (
      <p className="text-center text-black text-3xl p-5">Your cart is empty.</p>
    );

  return (
    <div className="p-5 text-black gap-5 flex flex-col items-center">
      <h1 className="text-3xl mb-5">Your Cart</h1>

      <div className="flex flex-col items-center w-full">
        {items.map(({ startDate, endDate, product }, index) => (
          <CartItem
            key={index}
            product={product!}
            startDate={startDate}
            endDate={endDate}
            onRemove={() =>
              setItems((prev) =>
                prev.filter(
                  (item) =>
                    !(
                      item.product?.id === product?.id &&
                      item.startDate === startDate &&
                      item.endDate === endDate
                    ),
                ),
              )
            }
            status="cart"
          />
        ))}
      </div>
      <Link
        href="/checkout"
        className="bg-decor-olive-600 w-1/3 hover:bg-decor-olive-400 text-4xl px-8 py-3 rounded-lg border text-center transition-colors duration-300"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

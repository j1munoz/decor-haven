"use client";

import { useEffect, useState } from "react";
import { getCart } from "@/utils/cart";
import { toast } from "react-hot-toast";
import CartItem from "@/components/cart/item";

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

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cost, setCost] = useState(0);

  const handleSubmit = async () => {
    try {
      // Get user from local dsstorage in userID
      const userid = localStorage.getItem("userId") || "CURRENT_USER_ID"; // Replace with real logged-in user id
      const orderItems = items.map(
        ({ itemId, startDate, endDate, product }) => ({
          userid: userid,
          itemid: itemId, // matches column
          start_date: startDate, // matches column
          end_date: endDate, // matches column
          price: product?.price || 0, // matches column
          status: "completed", // default status
        }),
      );

      console.log(
        "Submitting order for user:",
        userid,
        "with items:",
        orderItems,
      );

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems }),
      });

      if (!res.ok) throw new Error(`Failed to create order: ${res.status}`);

      toast.success("Thank you for your purchase!");
      // Clear cart
      localStorage.removeItem("cart");
      setItems([]);
      setCost(0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create order.");
    }
  };

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

        const totalCost = merged.reduce(
          (acc, item) => acc + ((item.product?.price as number) || 0),
          0,
        );
        setCost(totalCost);
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
      <h1 className="text-3xl mb-5">Proceed to Checkout</h1>

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
            status="checkout"
          />
        ))}
      </div>
      <div className="mt-6">
        <p className="text-4xl font-semibold">Total Due: ${cost.toFixed(2)}</p>
      </div>
      <div className="w-full max-w-md mt-8 p-5 border rounded-lg bg-decor-olive-600 shadow-xl text-white">
        <h2 className="text-5xl font-semibold mb-4">Card Details</h2>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-2xl">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-decor-olive-600 bg-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-2xl">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="border p-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-decor-olive-600 bg-white"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-medium text-2xl">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                className="border p-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-decor-olive-600 bg-white"
              />
            </div>

            <div className="flex flex-col w-24">
              <label className="mb-1 font-medium text-2xl">CVV</label>
              <input
                type="password"
                placeholder="123"
                maxLength={3}
                className="border p-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-decor-olive-600 bg-white"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-2xl">Street Address</label>
            <input
              type="text"
              placeholder="123 Main St"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-decor-olive-600 bg-white"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="mb-1 font-medium text-2xl">City</label>
            <input
              type="text"
              placeholder="Los Angeles"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-decor-olive-600 bg-white"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-medium text-2xl">State</label>
              <input
                type="text"
                placeholder="CA"
                maxLength={2}
                className="border p-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-decor-olive-600 bg-white"
              />
            </div>

            <div className="flex flex-col w-32">
              <label className="mb-1 font-medium text-2xl">ZIP Code</label>
              <input
                type="text"
                placeholder="90210"
                maxLength={10}
                className="border p-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-decor-olive-600 bg-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-decor-olive-600 hover:bg-decor-olive-400 text-white py-3 rounded-lg text-2xl mt-4 transition-colors duration-300"
          >
            Confirm Payment
          </button>
        </form>
      </div>
    </div>
  );
}

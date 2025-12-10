"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { addToCart } from "@/utils/cart";

interface DateRangePickerProps {
  id: string;
  stock?: number;
}

export default function DateRangePicker({ id, stock }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelect = (e, type) => {
    const value = e.target.value;

    if (type === "start") {
      setStartDate(value);

      // If start becomes greater than end, reset end date
      if (endDate && new Date(value) > new Date(endDate)) {
        setEndDate("");
        toast.error("End date cannot be before the start date.");
      }
    }

    if (type === "end") {
      // Validate end date >= start
      if (startDate && new Date(value) < new Date(startDate)) {
        toast.error("End date cannot be before the start date.");
        return; // Block update
      }

      setEndDate(value);
    }
  };

  const formattedRange =
    startDate && endDate
      ? `${format(new Date(startDate), "MMM d, yyyy")} - ${format(
          new Date(endDate),
          "MMM d, yyyy",
        )}`
      : "Select date range";

  return (
    <div className="relative w-full max-w-sm flex flex-col items-center gap-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-3 rounded-xl border bg-decor-olive-600 shadow-sm text-center text-3xl"
      >
        {formattedRange}
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-full p-4 bg-decor-olive-600 rounded-xl shadow-xl grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-2xl font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleSelect(e, "start")}
              className="p-2 rounded-lg bg-decor-olive-300"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-2xl font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleSelect(e, "end")}
              className="p-2 rounded-lg bg-decor-olive-300"
              disabled={!startDate}
            />
          </div>

          <button
            onClick={() => setOpen(false)}
            className="col-span-2 mt-2 p-2 bg-black text-white rounded-lg"
          >
            Done
          </button>
        </div>
      )}
      <button
        disabled={stock <= 0 || loading}
        className={`${
          stock <= 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-decor-olive-600 hover:bg-decor-olive-400 cursor-pointer"
        } text-4xl px-8 py-3 rounded-lg border transition-colors duration-300 flex items-center justify-center gap-2`}
        onClick={async () => {
          if (!startDate || !endDate) {
            toast.error(
              "Please select a valid date range before adding to cart.",
            );
            return;
          }

          if (stock <= 0) {
            toast.error("Sorry, this item is out of stock.");
            return;
          }

          setLoading(true);
          try {
            await addToCart(id, startDate, endDate);
            toast.success("Added to cart!");
          } catch (err) {
            toast.error("Failed to add to cart.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Adding..." : stock <= 0 ? "Out of Stock" : "Add To Cart"}
      </button>
    </div>
  );
}

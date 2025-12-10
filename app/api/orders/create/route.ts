import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const POST = async (req: NextRequest) => {
  try {
    const supabase = await createClient();
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided." },
        { status: 400 },
      );
    }

    // Map items to order rows
    const rows = items.map((item: any) => ({
      userid: item.userid,
      itemid: item.itemid,
      start_date: item.start_date,
      end_date: item.end_date,
      price: item.price,
      status: item.status || "completed",
    }));

    // Insert orders
    const { data, error } = await supabase.from("orders").insert(rows);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Decrement stock for each item
    for (const item of items) {
      // Fetch current stock
      const { data: currentItem, error: fetchError } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.itemid)
        .single();

      if (fetchError) {
        console.error("Failed to fetch stock:", fetchError);
        continue;
      }

      const newStock = (currentItem.stock || 0) - 1;

      const { error: updateError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.itemid);

      if (updateError) {
        console.error(
          "Failed to update stock for item:",
          item.itemid,
          updateError,
        );
      }
    }

    return NextResponse.json(
      { message: "Order created successfully", data },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 },
    );
  }
};

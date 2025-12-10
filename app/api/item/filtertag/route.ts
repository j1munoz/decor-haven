import { createClient } from "@/lib/supabase/server";

export const GET = async (request: Request) => {
  try {
    const supabase = await createClient();
    const url = new URL(request.url);
    const tag = url.searchParams.get("tag");

    let query = supabase.from("products").select("*");

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    const { data, error } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    const result = data.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_urls?.[0] || null,
      tags: item.tags,
    }));

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

import { createClient } from "@/lib/supabase/server";

export const GET = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image_urls");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const mappedData = data.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    image_url: item.image_urls?.[0] || null,
  }));

  return new Response(JSON.stringify(mappedData), {
    status: 200,
  });
};

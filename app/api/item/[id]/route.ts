import { createClient } from "@/lib/supabase/server";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const firstImage =
    Array.isArray(data.images) && data.images.length > 0
      ? data.image_urls[0]
      : null;

  return new Response(
    JSON.stringify({
      ...data,
      image: firstImage,
    }),
    { status: 200 },
  );
};

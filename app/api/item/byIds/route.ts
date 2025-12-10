import { createClient } from "@/lib/supabase/server";

export const POST = async (request: Request) => {
  try {
    const supabase = await createClient();
    const { ids } = await request.json();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", ids);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    const result = data.map((item) => {
      // Get only the first image path
      const firstImagePath = item.image_urls?.[0];

      // Convert to public URL if exists
      let image_url = null;
      if (firstImagePath) {
        const { data: publicData } = supabase.storage
          .from("products")
          .getPublicUrl(firstImagePath);
        image_url = publicData?.publicUrl || null;
      }

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        image_url,
      };
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

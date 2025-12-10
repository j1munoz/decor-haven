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

  return new Response(JSON.stringify(data), {
    status: 200,
  });
};

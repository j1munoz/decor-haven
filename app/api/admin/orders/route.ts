import { createClient } from "@/lib/supabase/server";

export const GET = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select("*");
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
  });
};

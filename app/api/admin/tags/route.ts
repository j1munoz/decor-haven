import { createClient } from "@/lib/supabase/client";

export const POST = async (req: Request) => {
  const supabase = createClient();
  const { name } = await req.json();

  if (!name) {
    return new Response(JSON.stringify({ error: "Tag name is required." }), {
      status: 400,
    });
  }

  const { error } = await supabase.from("tags").insert({ name });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "Tag added successfully." }), {
    status: 201,
  });
};

export const GET = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from("tags").select("*");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};

export const DELETE = async (req: Request) => {
  const supabase = createClient();
  const { id } = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ error: "Tag ID is required." }), {
      status: 400,
    });
  }

  const { error } = await supabase.from("tags").delete().eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Tag deleted successfully." }),
    {
      status: 200,
    },
  );
};

export const PUT = async (req: Request) => {
  const supabase = createClient();
  const { id, name } = await req.json();

  if (!id || !name) {
    return new Response(
      JSON.stringify({ error: "Tag ID and name are required." }),
      {
        status: 400,
      },
    );
  }

  const { error } = await supabase.from("tags").update({ name }).eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Tag updated successfully." }),
    {
      status: 200,
    },
  );
};

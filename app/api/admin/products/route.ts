import { createClient } from "@/lib/supabase/client";

export const GET = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST = async (request: Request) => {
  try {
    const supabase = await createClient();

    const formData = await request.formData();
    const name = formData.get("name")?.toString() || "";
    const price = Number(formData.get("price") || 0);
    const description = formData.get("description")?.toString() || "";
    const stock = Number(formData.get("stock") || 0);
    const tags = formData.getAll("tags[]").map((t) => t.toString());
    const included = formData.getAll("included[]").map((i) => i.toString());
    const images = formData.getAll("image_urls[]") as File[];

    if (
      !name ||
      !price ||
      !description ||
      !stock ||
      tags.length === 0 ||
      included.length === 0 ||
      images.length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "Please fill out all fields." }),
        { status: 400 },
      );
    }

    const uploadedImageUrls: string[] = [];

    for (const file of images) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) continue;

      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl)
        uploadedImageUrls.push(publicUrlData.publicUrl);
    }

    const { error: insertError } = await supabase.from("products").insert([
      {
        name,
        price,
        description,
        stock,
        tags,
        included,
        image_urls: uploadedImageUrls,
      },
    ]);

    if (insertError)
      return new Response(
        JSON.stringify({ error: "Failed to insert product" }),
        { status: 500 },
      );

    return new Response(JSON.stringify({ success: true, uploadedImageUrls }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

export const DELETE = async (req: Request) => {
  const supabase = createClient();
  const { id, image_urls } = (await req.json()) as {
    id: number;
    image_urls: string[];
  };

  const filePaths = image_urls.map((url) => {
    const parts = url.split("/");
    return parts.slice(parts.indexOf("products") + 1).join("/");
  });

  const { error: storageError } = await supabase.storage
    .from("products")
    .remove(filePaths);

  if (storageError) {
    console.error("Failed to delete images:", storageError);
    return new Response(
      JSON.stringify({ error: "Error deleting product images." }),
      { status: 500 },
    );
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: "Error deleting product." }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Product deleted successfully." }),
    {
      status: 200,
    },
  );
};

export const PUT = async (request: Request) => {
  try {
    const supabase = await createClient();
    const formData = await request.formData();

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString();
    const price = Number(formData.get("price") || 0);
    const description = formData.get("description")?.toString();
    const stock = Number(formData.get("stock") || 0);
    const tags = formData.getAll("tags[]").map((t) => t.toString());
    const included = formData.getAll("included[]").map((i) => i.toString());
    const oldImageUrls = formData
      .getAll("oldImageUrls[]")
      .map((i) => i.toString());
    const newImages = formData.getAll("newImages") as File[];

    if (!id || !name || !price || !description || !stock) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    let updatedImageUrls: string[] = [];

    if (newImages.length > 0) {
      // If new images exist, upload them and replace old ones
      for (const file of newImages) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, file);

        if (uploadError) {
          return new Response(
            JSON.stringify({ error: "Failed to upload image" }),
            { status: 500 },
          );
        }

        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl)
          updatedImageUrls.push(publicUrlData.publicUrl);
      }
    } else {
      // No new images → keep old ones
      updatedImageUrls = [...oldImageUrls];
    }

    // Update product by id
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        price,
        description,
        stock,
        tags,
        included,
        image_urls: updatedImageUrls,
      })
      .eq("id", id);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({ success: true, image_urls: updatedImageUrls }),
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

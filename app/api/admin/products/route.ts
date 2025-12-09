import { createClient } from "@/lib/supabase/client";

type ProductBody = {
  name: string;
  price: number;
  description: string;
  tags: string[];
  included: string[];
  stock: number;
  images: ProductFile[];
};

interface ProductFile {
  name: string;
  base64: string;
}

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
  const supabase = createClient();
  const body = (await request.json()) as ProductBody;
  const { name, price, description, tags, included, stock, images } = body;

  if (
    !name ||
    !price ||
    !description ||
    tags.length === 0 ||
    included.length === 0 ||
    !stock ||
    !images
  ) {
    return new Response(
      JSON.stringify({ error: "Please fill out all fields." }),
      { status: 400 },
    );
  }

  const uploadedImageUrls: string[] = [];

  for (const file of images) {
    const fileName = `${Date.now()}-${file.name}`;

    const base64Data = file.base64.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, buffer);
    if (error) console.error("Upload error:", error);

    const { data: publicUrl } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);
    if (publicUrl?.publicUrl) uploadedImageUrls.push(publicUrl.publicUrl);
  }

  const { error } = await supabase.from("products").insert([
    {
      name,
      description,
      stock,
      included,
      tags,
      image_urls: images,
      price,
    },
  ]);

  if (error) {
    return new Response(JSON.stringify({ error: "Error fetching items." }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "Item added successfully." }), {
    status: 201,
  });
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

export const PUT = async (req: Request) => {
  const supabase = createClient();

  const {
    id,
    name,
    price,
    description,
    tags,
    included,
    stock,
    existingUrls,
    newImages,
  } = await req.json();

  const finalUrls: string[] = [...existingUrls];

  if (newImages && newImages.length > 0) {
    for (const img of newImages) {
      try {
        const fileName = `${Date.now()}-${img.name}`;

        const base64 = img.base64.split(",")[1];
        const buffer = Buffer.from(base64, "base64");

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, buffer);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          finalUrls.push(urlData.publicUrl);
        }
      } catch (err) {
        console.error("Error processing new image:", err);
      }
    }
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      price,
      description,
      tags,
      included,
      stock,
      image_urls: finalUrls,
    })
    .eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: "Error updating product." }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Product updated successfully." }),
    { status: 200 },
  );
};

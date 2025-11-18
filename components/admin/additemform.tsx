"use client";
import { useState } from "react";
import TagSelector from "@/components/admin/tagselector";
import FeatureInput from "@/components/admin/featuretext";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-hot-toast";

interface AddItemFormProps {
  updateTable: () => void;
}

const AddItemForm = ({ updateTable }: AddItemFormProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [included, setIncluded] = useState<string[]>([]);
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState<FileList | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const supabase = createClient();
    e.preventDefault();

    if (
      !name ||
      !price ||
      !description ||
      tags.length === 0 ||
      included.length === 0 ||
      !stock ||
      !images
    ) {
      toast.error("Please fill out all fields.");
      return;
    }

    setSubmitting(true);

    const uploadedImageUrls: string[] = [];

    for (const file of Array.from(images)) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);
      if (publicUrl?.publicUrl) {
        uploadedImageUrls.push(publicUrl.publicUrl);
      }
    }

    const { error } = await supabase.from("products").insert([
      {
        name,
        description,
        stock,
        included,
        tags,
        image_urls: uploadedImageUrls,
        price,
      },
    ]);

    setSubmitting(false);

    if (error) {
      console.error("Insert error:", error);
      toast.error("Error adding item, please try again.");
      return;
    }

    setName("");
    setPrice(0);
    setDescription("");
    setTags([]);
    setIncluded([]);
    setStock(0);
    setImages(null);
    toast.success("Item added successfully!");
    updateTable();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center gap-5 w-full"
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Item Name</div>
        <input
          type="text"
          placeholder="Item Name"
          className="w-1/2 px-5 py-3 border bg-decor-beige-100 text-black"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Price</div>
        <input
          type="number"
          step="0.01"
          className="w-1/2 px-5 py-3 border bg-decor-beige-100 text-black"
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Description</div>
        <textarea
          placeholder="This item is..."
          className="w-full px-5 py-3 border rounded-md resize-none h-32 bg-decor-beige-100 text-black"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Select Tags</div>
        <TagSelector selectedTags={tags} setSelectedTags={setTags} />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Enter Its Features</div>
        <FeatureInput features={included} setFeatures={setIncluded} />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Current Stock</div>
        <input
          type="number"
          className="w-1/2 px-5 py-3 border bg-decor-beige-100 text-black"
          onChange={(e) => setStock(Number(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Upload Images</div>
        <input
          type="file"
          multiple
          className="w-2/3 px-5 py-3 border text-black"
          onChange={handleImageChange}
        />
      </div>
      <div className="flex flex-col items-center w-1/2 bg-decor-olive-600 text-decor-beige-100 hover:bg-decor-olive-400 transition-colors hover:cursor-pointer">
        <button className="w-1/2 text-2xl" type="submit">
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Spinner /> Loading
            </div>
          ) : (
            "Add Item"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddItemForm;

"use client";
import { useState } from "react";
import TagSelector from "@/components/admin/tagselector";
import FeatureInput from "@/components/admin/featuretext";
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

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!images) {
      toast.error("Please upload at least one image.");
      return;
    }

    setSubmitting(true);

    // Convert files to Base64
    const imageFiles = await Promise.all(
      Array.from(images).map(async (file) => ({
        name: file.name,
        base64: await fileToBase64(file),
      })),
    );

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price,
        description,
        tags,
        included,
        stock,
        images: imageFiles,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      toast.error("Error adding item.");
      return;
    }

    updateTable();
    toast.success("Item added successfully!");
    setName("");
    setPrice(0);
    setDescription("");
    setTags([]);
    setIncluded([]);
    setStock(0);
    setImages(null);
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

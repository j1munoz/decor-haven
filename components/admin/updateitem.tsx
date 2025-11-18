"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-hot-toast";
import TagSelector from "@/components/admin/tagselector";
import FeatureInput from "@/components/admin/featuretext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";

interface UpdateItemProps {
  item: {
    id: number;
    name: string;
    price: string;
    tags: string[];
    description: string;
    included: string[];
    stock: number;
    image_urls: string[];
  };
  updateTable: () => void;
}

const UpdateItemForm = ({ item, updateTable }: UpdateItemProps) => {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description);
  const [tags, setTags] = useState<string[]>(item.tags);
  const [included, setIncluded] = useState<string[]>(item.included);
  const [stock, setStock] = useState(item.stock);
  const [images, setImages] = useState<FileList | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    const supabase = createClient();
    e.preventDefault();
    setSubmitting(true);

    const updatedImageUrls = [...item.image_urls];

    // If user added new images
    if (images && images.length > 0) {
      for (const file of Array.from(images)) {
        const fileName = `${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast.error("Some images failed to upload.");
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          updatedImageUrls.push(publicUrlData.publicUrl);
        }
      }
    }

    // Update the product
    const { error } = await supabase
      .from("products")
      .update({
        name,
        price,
        tags,
        description,
        included,
        stock,
        image_urls: updatedImageUrls,
      })
      .eq("id", item.id);

    setSubmitting(false);

    if (error) {
      toast.error("Failed to update item.");
      return;
    }

    toast.success("Item updated!");
    updateTable();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handleDelete = async () => {
    const supabase = createClient();
    if (!confirm("Are you sure you want to delete this item?")) return;

    setSubmitting(true);

    try {
      const filePaths = item.image_urls.map((url) => {
        const parts = url.split("/");
        return parts.slice(parts.indexOf("products") + 1).join("/");
      });

      const { error: storageError } = await supabase.storage
        .from("products")
        .remove(filePaths);

      if (storageError) {
        console.error("Failed to delete images:", storageError);
        toast.error("Failed to delete item images.");
        setSubmitting(false);
        return;
      }

      const { error: dbError } = await supabase
        .from("products")
        .delete()
        .eq("id", item.id);

      if (dbError) {
        console.error("Failed to delete item:", dbError);
        toast.error("Failed to delete item.");
        setSubmitting(false);
        return;
      }

      toast.success("Item and images deleted successfully!");
      updateTable();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center gap-5 w-full"
    >
      <Carousel className="w-2/3 h-64 bg-decor-beige-100 text-decor-olive-600">
        <CarouselContent>
          {item.image_urls.map((url, index) => (
            <CarouselItem
              key={index}
              className="w-full h-64 flex items-center justify-center"
            >
              <Image
                src={url}
                alt={`Item Image ${index + 1}`}
                className="object-contain h-64"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-decor-olive-600 text-decor-beige-100 hover:bg-decor-olive-400">
          Prev
        </CarouselPrevious>
        <CarouselNext className="bg-decor-olive-600 text-decor-beige-100 hover:bg-decor-olive-400">
          Next
        </CarouselNext>
      </Carousel>
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Item Name</div>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          className="w-1/2 px-5 py-3 border bg-decor-beige-100 text-black"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Price</div>
        <input
          type="number"
          value={price}
          step="0.01"
          className="w-1/2 px-5 py-3 border bg-decor-beige-100 text-black"
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Description</div>
        <textarea
          placeholder="This item is..."
          value={description}
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
          value={stock}
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
      <div className="flex gap-6 items-center w-1/2">
        <button
          className="w-3/4 text-2xl bg-decor-olive-600 text-decor-beige-100 hover:bg-decor-olive-400 transition-colors hover:cursor-pointer py-2"
          type="submit"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Spinner /> Loading
            </div>
          ) : (
            "Save"
          )}
        </button>
        <button className="text-xl text-red-500" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </form>
  );
};

export default UpdateItemForm;

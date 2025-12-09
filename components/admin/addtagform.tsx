"use client";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-hot-toast";

interface AddTagFormProps {
  updateTable: () => void;
}

const AddTagForm = ({ updateTable }: AddTagFormProps) => {
  const [name, setName] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please enter a tag name.");
      return;
    }

    setSubmitting(true);
    const req = await fetch("/api/admin/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setSubmitting(false);

    const { error } = await req.json();
    if (error) {
      toast.error("Error adding tag.");
      return;
    }

    toast.success("Tag added successfully.");
    updateTable();
  };

  return (
    <form
      className="flex flex-col items-center gap-5 w-full"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Tag Name</div>
        <input
          type="text"
          placeholder="Tag Name"
          className="w-1/2 px-5 py-3 border bg-decor-beige-100 text-black mb-10"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-center w-1/2 bg-decor-olive-600 text-decor-beige-100 hover:bg-decor-olive-400 transition-colors hover:cursor-pointer">
        <button className="w-1/2 text-2xl" type="submit">
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Spinner /> Loading
            </div>
          ) : (
            "Add Tag"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddTagForm;

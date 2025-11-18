"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

interface UpdateTagProps {
  tag: {
    id: number;
    name: string;
  };
  updateTable: () => void;
}

const UpdateTag = ({ tag, updateTable }: UpdateTagProps) => {
  const [name, setName] = useState(tag.name);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    const supabase = createClient();
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from("tags")
      .update({
        name: name,
      })
      .eq("id", tag.id);

    setSubmitting(false);

    if (error) {
      toast.error("Error updating tag.");
      return;
    }

    toast.success("Tag updated successfully.");
    updateTable();
  };

  const handleDelete = async () => {
    const supabase = createClient();
    const confirmDelete = confirm(
      `Are you sure you want to delete the tag "${tag.name}"? This action cannot be undone.`,
    );

    if (!confirmDelete) return;

    setSubmitting(true);

    const { error } = await supabase.from("tags").delete().eq("id", tag.id);

    setSubmitting(false);

    if (error) {
      toast.error("Error deleting tag.");
      return;
    }

    toast.success("Tag deleted successfully.");
    updateTable();
  };

  return (
    <form className="flex flex-col items-center gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 w-full">
        <div className="text-2xl">Tag Name</div>
        <input
          type="text"
          value={name}
          className="w-1/2 px-5 py-3 border bg-decor-beige-100 text-black"
          onChange={(e) => setName(e.target.value)}
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

export default UpdateTag;

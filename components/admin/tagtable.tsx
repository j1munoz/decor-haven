"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import DataTable from "@/components/admin/table";
import { tags } from "@/data/admin/tables";
import { TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaEdit } from "react-icons/fa";
import UpdateTagForm from "@/components/admin/updatetag";
import AddTag from "@/components/admin/addtag";

interface TagProps {
  id: number;
  name: string;
}

const TagsTable = () => {
  const [tagsData, setTagsData] = useState<TagProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/tags");

    if (!res.ok) {
      toast.error("Error fetching tags.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setLoading(false);

    setTagsData(data || []);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center text-5xl mt-10 text-decor-olive-600">
        Tags Dashboard
      </div>
      <DataTable
        headers={tags}
        data={tagsData}
        row={(tags) => (
          <>
            <TableCell className="whitespace-normal break-words">
              {tags.name}
            </TableCell>
            <Dialog>
              <DialogTrigger asChild>
                <td className="cursor-pointer text-decor-olive-600 hover:text-decor-olive-400">
                  <FaEdit />
                </td>
              </DialogTrigger>
              <DialogContent className="h-[40vh] overflow-y-auto bg-decor-beige-100 text-decor-olive-600">
                <DialogHeader>
                  <DialogTitle className="text-4xl">Tag Details</DialogTitle>
                  <DialogDescription className="text-xl">
                    Change or delete the <strong>{tags.name}</strong> tag.
                  </DialogDescription>
                </DialogHeader>
                <UpdateTagForm tag={tags} updateTable={() => fetchTags()} />
              </DialogContent>
            </Dialog>
          </>
        )}
      />
      {loading && (
        <div className="flex items-center gap-2 text-2xl text-decor-olive-600">
          <Spinner />
          Loading tags...
        </div>
      )}
      <AddTag updateTable={() => fetchTags()} />
    </div>
  );
};

export default TagsTable;

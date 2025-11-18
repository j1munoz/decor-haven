"use client";

import { items } from "@/data/admin/tables";
import DataTable from "@/components/admin/table";
import { TableCell } from "@/components/ui/table";
import AddItem from "@/components/admin/additem";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaEdit } from "react-icons/fa";
import UpdateItemForm from "@/components/admin/updateitem";

interface ProductProps {
  id: number;
  name: string;
  price: string;
  tags: string[];
  description: string;
  included: string[];
  stock: number;
  image_urls: string[];
}

const ItemTable = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    const supabase = createClient();
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*");
    setLoading(false);

    if (error) {
      toast.error("Error fetching products.");
      return;
    }

    if (data) {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center text-5xl mt-10 text-decor-olive-600">
        Items Dashboard
      </div>
      <DataTable
        headers={items}
        data={products}
        row={(itemRow) => (
          <>
            {/* <TableCell className="whitespace-normal break-words">{itemRow.id}</TableCell> */}
            <TableCell className="whitespace-normal break-words">
              {itemRow.name}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              ${itemRow.price}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {itemRow.tags.join(", ")}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {itemRow.description}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {itemRow.included.join(", ")}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {itemRow.stock}
            </TableCell>
            {/* <TableCell className="whitespace-normal break-words">{itemRow.image_urls}</TableCell> */}
            <Dialog>
              <DialogTrigger asChild>
                <td className="cursor-pointer text-decor-olive-600 hover:text-decor-olive-400">
                  <FaEdit />
                </td>
              </DialogTrigger>
              <DialogContent className="h-[80vh] overflow-y-auto bg-decor-beige-100 text-decor-olive-600">
                <DialogHeader>
                  <DialogTitle className="text-4xl">{itemRow.name}</DialogTitle>
                  <DialogDescription className="text-xl">
                    Item Details
                  </DialogDescription>
                </DialogHeader>
                <UpdateItemForm
                  item={itemRow}
                  updateTable={() => fetchItems()}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      />
      {loading && (
        <div className="flex items-center gap-2 text-2xl text-decor-olive-600">
          <Spinner />
          Loading items...
        </div>
      )}
      <AddItem updateTable={() => fetchItems()} />
    </div>
  );
};

export default ItemTable;

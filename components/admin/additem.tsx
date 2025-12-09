import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import AddItemForm from "@/components/admin/additemform";

interface AddItemProps {
  updateTable: () => void;
}

const AddItem = ({ updateTable }: AddItemProps) => {
  return (
    <Dialog>
      <DialogTrigger className="w-1/4 flex flex-col items-center">
        <div className="w-full text-black border-black border px-8 py-4 text-2xl hover:bg-decor-olive-600 hover:text-decor-beige-100 transition-colors">
          + Add Item
        </div>
      </DialogTrigger>
      <DialogContent className="h-[80vh] overflow-y-auto bg-decor-beige-100 text-decor-olive-600">
        <DialogHeader>
          <DialogTitle>Add an Item</DialogTitle>
          <DialogDescription>
            Add in a new item to the database.
          </DialogDescription>
        </DialogHeader>
        <AddItemForm updateTable={() => updateTable} />
      </DialogContent>
    </Dialog>
  );
};

export default AddItem;

import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import AddTagForm from "@/components/admin/addtagform";

interface AddTagProps {
  updateTable: () => void;
}

const AddTag = ({ updateTable }: AddTagProps) => {
  return (
    <Dialog>
      <DialogTrigger className="w-1/4 flex flex-col items-center">
        <div className="w-full text-black border-black border px-8 py-4 text-2xl hover:bg-decor-olive-600 hover:text-decor-beige-100 transition-colors">
          + Add Tag
        </div>
      </DialogTrigger>
      <DialogContent className="h-[40vh] overflow-y-auto bg-decor-beige-100 text-decor-olive-600">
        <DialogHeader>
          <DialogTitle>Add a Tag</DialogTitle>
          <DialogDescription>
            Add in a new tag to the database.
          </DialogDescription>
        </DialogHeader>
        <AddTagForm updateTable={() => updateTable} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTag;

"use client";

import DataTable from "@/components/admin/table";
import { TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { users } from "@/data/admin/tables";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaEdit } from "react-icons/fa";

interface CustomerTableProps {
  first_name: string;
  last_name: string;
  role: number;
}

const CustomerTable = () => {
  const [customerData, setCustomerData] = useState<CustomerTableProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomerData = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/customers");

    if (!res.ok) {
      toast.error("Error fetching admin data.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setCustomerData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center text-5xl mt-10 text-decor-olive-600">
        Admins Dashboard
      </div>
      <DataTable
        headers={users}
        data={customerData}
        row={(customer) => (
          <>
            <TableCell className="whitespace-normal break-words">
              {customer.first_name}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {customer.last_name}
            </TableCell>
          </>
        )}
      />
      {loading && (
        <div className="flex items-center gap-2 text-2xl text-decor-olive-600">
          <Spinner />
          Loading admins...
        </div>
      )}
      {/* <AddTag updateTable={() => fetchTags()} /> */}
    </div>
  );
};

export default CustomerTable;

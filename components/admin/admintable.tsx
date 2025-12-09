"use client";

import DataTable from "@/components/admin/table";
import { TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { users } from "@/data/admin/tables";

interface AdminTableProps {
  first_name: string;
  last_name: string;
  role: number;
}

const AdminTable = () => {
  const [adminData, setAdminData] = useState<AdminTableProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/admins");

    if (!res.ok) {
      toast.error("Error fetching admin data.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setAdminData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center text-5xl mt-10 text-decor-olive-600">
        Admins Dashboard
      </div>
      <DataTable
        headers={users}
        data={adminData}
        row={(admin) => (
          <>
            <TableCell className="whitespace-normal break-words">
              {admin.first_name}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {admin.last_name}
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
    </div>
  );
};

export default AdminTable;

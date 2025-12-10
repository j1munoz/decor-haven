"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import DataTable from "@/components/admin/table";
import { orders } from "@/data/admin/tables";
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

interface OrderProps {
  id: number;
  userid: number;
  itemid: string;
  start_date: string;
  end_date: string;
  price: string;
  created_at: string;
  status: string;
}

const OrdersTable = () => {
  const [ordersData, setOrdersData] = useState<OrderProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");

    if (!res.ok) {
      toast.error("Error fetching orders.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setLoading(false);

    setOrdersData(data || []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center text-5xl mt-10 text-decor-olive-600">
        Orders Dashboard
      </div>
      <DataTable
        headers={orders}
        data={ordersData}
        row={(order) => (
          <>
            <TableCell className="whitespace-normal break-words">
              {order.id}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {order.userid}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {order.itemid}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {formatDate(order.start_date)}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {formatDate(order.end_date)}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              ${order.price}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {formatDate(order.created_at)}
            </TableCell>
            <TableCell className="whitespace-normal break-words">
              {order.status}
            </TableCell>
          </>
        )}
      />
      {loading && (
        <div className="flex items-center gap-2 text-2xl text-decor-olive-600">
          <Spinner />
          Loading orders...
        </div>
      )}
    </div>
  );
};

export default OrdersTable;

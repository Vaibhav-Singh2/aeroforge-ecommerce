"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye, Download } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePrintOrderStatus } from "@/lib/actions/print-order-actions";
import { formatDate } from "@/lib/utils";

interface PrintOrder {
  id: string;
  printNumber: string;
  status: string;
  projectName: string;
  fileUrls: string[];
  totalCost: number | null;
  material: string;
  completedAt: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface PrintOrdersTableProps {
  initialPrintOrders: PrintOrder[] | undefined;
  error?: string;
}

export default function PrintOrdersTable({
  initialPrintOrders,
  error,
}: PrintOrdersTableProps) {
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>(
    initialPrintOrders || [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("status", newStatus);

      const result = await updatePrintOrderStatus(formData);

      if (result.success) {
        // Update the local state
        setPrintOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
        toast.success("Print order status updated successfully");
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Format price
  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Filter and search orders
  const filteredOrders = printOrders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      order.printNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return (
      matchesSearch && order.status.toLowerCase() === statusFilter.toLowerCase()
    );
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "QUOTE_REQUESTED":
        return "bg-gray-500";
      case "QUOTE_SENT":
        return "bg-blue-500";
      case "QUOTE_APPROVED":
        return "bg-indigo-500";
      case "QUEUED":
        return "bg-purple-500";
      case "PRINTING":
        return "bg-amber-500";
      case "POST_PROCESSING":
        return "bg-orange-500";
      case "COMPLETED":
        return "bg-green-500";
      case "READY_FOR_PICKUP":
        return "bg-emerald-500";
      case "SHIPPED":
        return "bg-teal-500";
      case "DELIVERED":
        return "bg-green-600";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search print orders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Status:</span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="QUOTE_REQUESTED">Quote Requested</SelectItem>
              <SelectItem value="QUOTE_SENT">Quote Sent</SelectItem>
              <SelectItem value="QUOTE_APPROVED">Quote Approved</SelectItem>
              <SelectItem value="QUEUED">Queued</SelectItem>
              <SelectItem value="PRINTING">Printing</SelectItem>
              <SelectItem value="POST_PROCESSING">Post Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="READY_FOR_PICKUP">Ready for Pickup</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order #</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No print orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.printNumber}
                  </TableCell>
                  <TableCell>{order.projectName}</TableCell>
                  <TableCell>
                    <div>{order.user.name}</div>
                    <div className="text-xs text-gray-500">
                      {order.user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(order.id, value)
                      }
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="h-8 w-[140px]">
                        <SelectValue>
                          <Badge
                            className={`${getStatusColor(order.status)} text-white`}
                          >
                            {order.status.replace(/_/g, " ")}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QUOTE_REQUESTED">
                          Quote Requested
                        </SelectItem>
                        <SelectItem value="QUOTE_SENT">Quote Sent</SelectItem>
                        <SelectItem value="QUOTE_APPROVED">
                          Quote Approved
                        </SelectItem>
                        <SelectItem value="QUEUED">Queued</SelectItem>
                        <SelectItem value="PRINTING">Printing</SelectItem>
                        <SelectItem value="POST_PROCESSING">
                          Post Processing
                        </SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="READY_FOR_PICKUP">
                          Ready for Pickup
                        </SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{order.material}</TableCell>
                  <TableCell>{formatPrice(order.totalCost)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/print-orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      {order.fileUrls.length > 0 && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={order.fileUrls[0]} target="_blank">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

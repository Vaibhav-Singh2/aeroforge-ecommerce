"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

// Type definition for Print Order
type PrintOrder = {
  id: string;
  printNumber: string;
  projectName: string;
  material: string;
  quantity: number;
  status: string;
  createdAt: Date;
  totalCost: number | null;
  quoteSentAt?: Date;
  quoteApprovedAt?: Date;
  printStartedAt?: Date;
  completedAt?: Date;
};

export default function PrintOrdersPage() {
  const router = useRouter();
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch print orders from the API
  useEffect(() => {
    const fetchPrintOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/print-orders");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        // Transform dates from strings to Date objects
        const ordersWithDates = data.printOrders.map(
          (
            order: PrintOrder & {
              createdAt: string;
              quoteSentAt?: string;
              quoteApprovedAt?: string;
              printStartedAt?: string;
              completedAt?: string;
            },
          ) => ({
            ...order,
            createdAt: new Date(order.createdAt),
            quoteSentAt: order.quoteSentAt
              ? new Date(order.quoteSentAt)
              : undefined,
            quoteApprovedAt: order.quoteApprovedAt
              ? new Date(order.quoteApprovedAt)
              : undefined,
            printStartedAt: order.printStartedAt
              ? new Date(order.printStartedAt)
              : undefined,
            completedAt: order.completedAt
              ? new Date(order.completedAt)
              : undefined,
          }),
        );

        setPrintOrders(ordersWithDates);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch print orders:", err);
        setError("Failed to load your print orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrintOrders();
  }, []);

  // Status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "QUOTE_REQUESTED":
        return <Badge variant="outline">Quote Requested</Badge>;
      case "QUOTE_SENT":
        return <Badge variant="secondary">Quote Sent</Badge>;
      case "QUOTE_APPROVED":
        return <Badge>Quote Approved</Badge>;
      case "QUEUED":
        return <Badge className="bg-blue-500">Queued</Badge>;
      case "PRINTING":
        return <Badge className="bg-violet-500">Printing</Badge>;
      case "POST_PROCESSING":
        return <Badge className="bg-indigo-500">Post Processing</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "READY_FOR_PICKUP":
        return <Badge className="bg-amber-500">Ready for Pickup</Badge>;
      case "SHIPPED":
        return <Badge className="bg-orange-500">Shipped</Badge>;
      case "DELIVERED":
        return <Badge className="bg-green-700">Delivered</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format material type for display
  const formatMaterial = (material: string) => {
    switch (material) {
      case "PLA":
        return "PLA";
      case "ABS":
        return "ABS";
      case "PETG":
        return "PETG";
      case "TPU":
        return "TPU (Flexible)";
      case "WOOD_FILL":
        return "Wood Fill";
      case "METAL_FILL":
        return "Metal Fill";
      case "CARBON_FIBER":
        return "Carbon Fiber";
      case "RESIN":
        return "Resin";
      default:
        return material;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">3D Print Orders</h1>
        <Button asChild size="sm">
          <Link href="/services/3d-printing">Request New Print</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2 px-4 sm:px-6">
          <CardTitle className="text-lg">Your 3D Print History</CardTitle>
        </CardHeader>
        <CardContent>
          {" "}
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <div className="border-primary mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
                <p>Loading your print orders...</p>
              </div>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <h3 className="mb-1 text-lg font-medium text-red-500">Error</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : printOrders.length > 0 ? (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Print #</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {printOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.printNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{order.projectName}</div>
                          <div className="text-muted-foreground text-sm">
                            Qty: {order.quantity}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatMaterial(order.material)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {format(order.createdAt, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {order.totalCost ? `₹${order.totalCost}` : "Pending"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() =>
                            router.push(`/account/print-orders/${order.id}`)
                          }
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <h3 className="mb-1 text-lg font-medium">No print orders yet</h3>
              <p className="text-muted-foreground mb-4">
                {`You haven't submitted any 3D print requests yet.`}
              </p>
              <Button asChild>
                <Link href="/services/3d-printing">Request a Print</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

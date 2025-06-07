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

// This would normally come from your API
type PrintOrder = {
  id: string;
  printNumber: string;
  projectName: string;
  material: string;
  quantity: number;
  status: string;
  createdAt: Date;
  totalCost: number | null;
};

export default function PrintOrdersPage() {
  const router = useRouter();
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - this would be replaced with an actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPrintOrders([
        {
          id: "1",
          printNumber: "PRT12345",
          projectName: "Custom Drone Frame",
          material: "PLA",
          quantity: 1,
          status: "PRINTING",
          createdAt: new Date(2025, 5, 4), // June 4, 2025
          totalCost: 1299,
        },
        {
          id: "2",
          printNumber: "PRT12346",
          projectName: "RC Car Parts Set",
          material: "PETG",
          quantity: 4,
          status: "QUOTE_APPROVED",
          createdAt: new Date(2025, 5, 17), // June 17, 2025
          totalCost: 899,
        },
        {
          id: "3",
          printNumber: "PRT12347",
          projectName: "Drone Landing Gear",
          material: "TPU",
          quantity: 2,
          status: "COMPLETED",
          createdAt: new Date(2025, 5, 1), // June 1, 2025
          totalCost: 599,
        },
      ]);
      setIsLoading(false);
    }, 1000);
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
    <div className="space-y-6 px-1 pb-5 md:px-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">3D Print Orders</h1>
        <Button asChild>
          <Link href="/services/3d-printing">Request New Print</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your 3D Print History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <div className="border-primary mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
                <p>Loading your print orders...</p>
              </div>
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

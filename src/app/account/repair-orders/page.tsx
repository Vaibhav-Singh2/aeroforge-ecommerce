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
type RepairOrder = {
  id: string;
  repairNumber: string;
  deviceType: string;
  deviceModel: string;
  status: string;
  createdAt: Date;
  estimatedCost: number | null;
};

export default function RepairOrdersPage() {
  const router = useRouter();
  const [repairOrders, setRepairOrders] = useState<RepairOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - this would be replaced with an actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRepairOrders([
        {
          id: "1",
          repairNumber: "REP12345",
          deviceType: "drone",
          deviceModel: "Phantom 4 Pro",
          status: "QUOTE_SENT",
          createdAt: new Date(2025, 5, 1), // June 1, 2025
          estimatedCost: 3499,
        },
        {
          id: "2",
          repairNumber: "REP12346",
          deviceType: "rc-car",
          deviceModel: "Traxxas Slash",
          status: "IN_PROGRESS",
          createdAt: new Date(2025, 5, 15), // June 15, 2025
          estimatedCost: 1999,
        },
        {
          id: "3",
          repairNumber: "REP12347",
          deviceType: "rc-plane",
          deviceModel: "HobbyZone Champ",
          status: "COMPLETED",
          createdAt: new Date(2025, 4, 20), // May 20, 2025
          estimatedCost: 1299,
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
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "READY_FOR_PICKUP":
        return <Badge className="bg-amber-500">Ready for Pickup</Badge>;
      case "DELIVERED":
        return <Badge className="bg-green-700">Delivered</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format device type for display
  const formatDeviceType = (type: string) => {
    switch (type) {
      case "drone":
        return "Drone";
      case "rc-plane":
        return "RC Plane";
      case "rc-car":
        return "RC Car/Truck";
      case "rc-helicopter":
        return "RC Helicopter";
      default:
        return type
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  return (
    <div className="space-y-6 px-1 pb-5 md:px-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Repair Orders</h1>
        <Button asChild>
          <Link href="/services/repair">Request New Repair</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Repair History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <div className="border-primary mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
                <p>Loading your repair orders...</p>
              </div>
            </div>
          ) : repairOrders.length > 0 ? (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repair #</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repairOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.repairNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{formatDeviceType(order.deviceType)}</div>
                          <div className="text-muted-foreground text-sm">
                            {order.deviceModel}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {format(order.createdAt, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {order.estimatedCost
                          ? `₹${order.estimatedCost}`
                          : "Pending"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() =>
                            router.push(`/account/repair-orders/${order.id}`)
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
              <h3 className="mb-1 text-lg font-medium">No repair orders yet</h3>
              <p className="text-muted-foreground mb-4">
                {`You haven't submitted any repair requests yet.`}
              </p>
              <Button asChild>
                <Link href="/services/repair">Request a Repair</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

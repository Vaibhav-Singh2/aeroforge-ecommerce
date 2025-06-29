import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Repair Orders - Drone Store",
  description: "View your repair service requests",
};

// This page uses dynamic data, so we need to opt out of static rendering
export const dynamic = "force-dynamic";

async function getUserRepairOrders() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get all repair orders for the user
    const repairOrders = await prisma.repairOrder.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return repairOrders;
  } catch (error) {
    console.error("Failed to get repair orders:", error);
    return [];
  }
}

// Function to get status badge color
function getStatusBadgeColor(status: string) {
  switch (status) {
    case "QUOTE_REQUESTED":
      return "bg-blue-100 text-blue-800";
    case "QUOTE_SENT":
      return "bg-purple-100 text-purple-800";
    case "QUOTE_APPROVED":
      return "bg-indigo-100 text-indigo-800";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "READY_FOR_PICKUP":
      return "bg-emerald-100 text-emerald-800";
    case "DELIVERED":
      return "bg-teal-100 text-teal-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Function to format status display
function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function RepairOrdersPage() {
  const repairOrders = await getUserRepairOrders();

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Repair Orders</h1>
        <Button asChild>
          <Link href="/services/repair">Request New Repair</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Repair History</CardTitle>
        </CardHeader>
        <CardContent>
          {repairOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              {" "}
              <p className="text-muted-foreground mb-4">
                You haven&apos;t placed any repair orders yet.
              </p>
              <Button asChild>
                <Link href="/services/repair">Request a Repair</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repairOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.repairNumber}
                      </TableCell>
                      <TableCell>
                        {order.deviceModel}
                        {order.deviceBrand ? ` (${order.deviceBrand})` : ""}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusBadgeColor(order.status)}
                          variant="outline"
                        >
                          {formatStatus(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.estimatedCost
                          ? `$${order.estimatedCost.toFixed(2)}`
                          : "Pending"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/account/repair-orders/${order.id}`}>
                            Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

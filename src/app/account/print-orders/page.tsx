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
  title: "3D Print Orders - Drone Store",
  description: "View your 3D printing service requests",
};

// This page uses dynamic data, so we need to opt out of static rendering
export const dynamic = "force-dynamic";

async function getUserPrintOrders() {
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

    // Get all print orders for the user
    const printOrders = await prisma.printOrder.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return printOrders;
  } catch (error) {
    console.error("Failed to get print orders:", error);
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
    case "QUEUED":
      return "bg-amber-100 text-amber-800";
    case "PRINTING":
      return "bg-yellow-100 text-yellow-800";
    case "POST_PROCESSING":
      return "bg-orange-100 text-orange-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "READY_FOR_PICKUP":
      return "bg-emerald-100 text-emerald-800";
    case "SHIPPED":
      return "bg-sky-100 text-sky-800";
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

export default async function PrintOrdersPage() {
  const printOrders = await getUserPrintOrders();

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">3D Print Orders</h1>
        <Button asChild>
          <Link href="/services/3d-printing">Request New Print</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Print Orders History</CardTitle>
        </CardHeader>
        <CardContent>
          {printOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">
                You haven&apos;t placed any print orders yet.
              </p>
              <Button asChild>
                <Link href="/services/3d-printing">Request a Print</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {printOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.printNumber}
                      </TableCell>
                      <TableCell>
                        {order.projectName} (x{order.quantity})
                      </TableCell>
                      <TableCell>{order.material}</TableCell>
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
                        {order.totalCost
                          ? `$${order.totalCost.toFixed(2)}`
                          : "Pending"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/account/print-orders/${order.id}`}>
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

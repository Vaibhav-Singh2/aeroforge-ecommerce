"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Order as PrismaOrder, OrderStatus, OrderItem } from "@prisma/client";
import { Package, ChevronRight, Search, ArrowLeft } from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addToast } from "@/lib/redux/features/uiSlice";
import { cancelOrder } from "@/lib/actions/order-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvoiceModal } from "@/components/account/invoice-modal";

// Helper function to get status badge variant
function getStatusBadgeVariant(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "outline";
    case "CONFIRMED":
      return "default";
    case "PROCESSING":
      return "default";
    case "SHIPPED":
      return "secondary";
    case "DELIVERED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "REFUNDED":
      return "destructive";
    default:
      return "secondary";
  }
}

// Helper function to format status text for display
function formatStatus(status: OrderStatus) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Helper function to format price
function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
}

// Define extended Order type with items relation
type Order = PrismaOrder & {
  items: OrderItem[];
};

// Type for component props including full Order objects from prisma
type OrderHistoryProps = {
  orders: Order[];
};

export function OrderHistory({ orders }: OrderHistoryProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Handle navigating back
  const handleBack = () => {
    router.back();
  };

  // Handle cancelling an order
  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setIsLoading(orderId);
        await cancelOrder(orderId);
        dispatch(
          addToast({
            type: "success",
            title: "Order cancelled",
            message: "Your order has been cancelled successfully.",
          }),
        );
        router.refresh(); // Refresh to update the UI
      } catch (error) {
        console.error("Error cancelling order:", error);
        dispatch(
          addToast({
            type: "error",
            title: "Error",
            message: "Failed to cancel your order. Please try again.",
          }),
        );
      } finally {
        setIsLoading(null);
      }
    }
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Render empty state if no orders
  if (orders.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Your Orders</h1>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center pt-6 pb-16 text-center">
            <Package className="text-muted-foreground mb-4 h-16 w-16" />
            <h2 className="mb-2 text-xl font-semibold">No orders yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {`You haven't placed any orders yet. Start shopping to see your
              orders here.`}
            </p>
            <Button asChild>
              <Link href="/category/projects">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Your Orders</h1>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground py-4">
                No orders match your search.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 px-4 sm:px-6 py-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <CardTitle className="flex flex-wrap items-center gap-2 text-base font-semibold">
                      <span>Order #{order.orderNumber}</span>
                      <Badge
                        variant={getStatusBadgeVariant(order.status)}
                        className="text-xs"
                      >
                        {formatStatus(order.status)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Placed{" "}
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <div className="text-base sm:text-lg font-bold text-foreground">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {order.paymentStatus === "PAID"
                        ? "● Paid"
                        : "● Payment Pending"}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 py-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Items:</span>{" "}
                      <span className="font-semibold text-foreground">{order.items?.length || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Shipping:</span>{" "}
                      <span className="font-semibold text-foreground uppercase">{order.shippingMethod}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center gap-2.5 border-t px-4 sm:px-6 py-3.5 bg-muted/20">
                <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                  <Link href={`/account/orders/${order.id}`}>
                    View Details
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>

                <InvoiceModal order={order} />

                {(order.status === "PENDING" ||
                  order.status === "CONFIRMED") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={isLoading === order.id}
                  >
                    {isLoading === order.id ? "Cancelling..." : "Cancel Order"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

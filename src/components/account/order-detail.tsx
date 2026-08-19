"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ChevronLeft, Package, Truck, MapPin, Copy } from "lucide-react";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addToast } from "@/lib/redux/features/uiSlice";
import { cancelOrder } from "@/lib/actions/order-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderTimelineStepper } from "@/components/account/order-timeline-stepper";
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
function formatStatus(status: OrderStatus | PaymentStatus) {
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

// Types for Order and related entities
interface OrderItem {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  name: string;
  image?: string | null;
  product?: {
    slug: string;
  };
  variant?: {
    name: string;
  } | null;
}

interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  company?: string | null;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  shippingAddressId?: string | null;
  shippingAddress?: ShippingAddress | null;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  paymentMethod?: string | null;
  paymentIntentId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  shippedAt?: Date | string | null;
  deliveredAt?: Date | string | null;
  items: OrderItem[];
  customerNotes?: string | null;
}

// Type for component props including full Order object with relations
type OrderDetailProps = {
  order: Order;
};

export function OrderDetail({ order }: OrderDetailProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Copy order number to clipboard
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    dispatch(
      addToast({
        type: "success",
        title: "Copied!",
        message: "Order number copied to clipboard",
      }),
    );
  };

  // Handle cancelling an order
  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setIsLoading(true);
        await cancelOrder(order.id);
        dispatch(
          addToast({
            type: "success",
            title: "Order cancelled",
            message: "Your order has been cancelled successfully.",
          }),
        );
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
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-col space-y-6">
        {/* Back button and header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Button
            asChild
            variant="ghost"
            className="h-auto w-fit p-0"
            size="sm"
          >
            <Link
              href="/account/orders"
              className="flex items-center gap-1 text-base font-normal"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Orders
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-medium">{order.orderNumber}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyOrderNumber}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <InvoiceModal order={order} />
          </div>
        </div>

        {/* Order status */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Status Card */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                Order Status & Fulfillment
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Visual Delivery Stepper */}
              <div className="rounded-xl border bg-muted/20 p-4">
                <OrderTimelineStepper
                  status={order.status}
                  createdAt={order.createdAt}
                  shippedAt={order.shippedAt}
                  deliveredAt={order.deliveredAt}
                  trackingNumber={order.trackingNumber}
                />
              </div>

              <div className="text-sm">
                <p className="font-medium">Order placed</p>
                <p className="text-muted-foreground">
                  {format(
                    new Date(order.createdAt),
                    "MMMM d, yyyy 'at' h:mm a",
                  )}
                </p>
              </div>

              {order.shippedAt && (
                <div className="mt-4 text-sm">
                  <p className="font-medium">Shipped</p>
                  <p className="text-muted-foreground">
                    {format(
                      new Date(order.shippedAt),
                      "MMMM d, yyyy 'at' h:mm a",
                    )}
                  </p>
                  {order.trackingNumber && (
                    <div className="mt-1">
                      <p className="font-medium">Tracking Number</p>
                      <p className="text-muted-foreground">
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {order.deliveredAt && (
                <div className="mt-4 text-sm">
                  <p className="font-medium">Delivered</p>
                  <p className="text-muted-foreground">
                    {format(
                      new Date(order.deliveredAt),
                      "MMMM d, yyyy 'at' h:mm a",
                    )}
                  </p>
                </div>
              )}

              {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                <div className="mt-6">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancelOrder}
                    disabled={isLoading}
                  >
                    {isLoading ? "Cancelling..." : "Cancel Order"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                Payment{" "}
                <Badge
                  variant={
                    order.paymentStatus === "PAID" ? "default" : "outline"
                  }
                >
                  {formatStatus(order.paymentStatus)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-medium">Payment Method</p>
                <p className="text-muted-foreground">
                  {order.paymentMethod || "Not specified"}
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shippingAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.taxAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order details tabs */}
        <Tabs defaultValue="items" className="mt-6">
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Information</TabsTrigger>
          </TabsList>

          {/* Order Items Tab */}
          <TabsContent value="items" className="mt-4">
            <Card>
              <CardContent className="divide-y p-6">
                {order.items.map((item: OrderItem) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="bg-muted relative h-20 w-20 overflow-hidden rounded">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="bg-secondary flex h-full w-full items-center justify-center">
                            <Package className="text-muted-foreground h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <Link
                          href={`/product/${item.product?.slug || "#"}`}
                          className="font-medium hover:underline"
                        >
                          {item.name}
                        </Link>{" "}
                        {item.variant && (
                          <p className="text-muted-foreground text-sm">
                            Variant: {item.variant.name}
                          </p>
                        )}
                        <div className="flex items-center gap-4">
                          <p className="text-sm">
                            Qty:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </p>
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Information Tab */}
          <TabsContent value="shipping" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                {order.shippingAddress ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {order.shippingAddress.firstName}{" "}
                        {order.shippingAddress.lastName}
                      </p>
                      <p>{order.shippingAddress.address1}</p>
                      {order.shippingAddress.address2 && (
                        <p>{order.shippingAddress.address2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && (
                        <p>{order.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No shipping address found
                  </p>
                )}

                <Separator className="my-4" />

                <div className="flex items-start gap-3">
                  <Truck className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Shipping Method</p>
                    <p className="text-muted-foreground">
                      {order.shippingMethod}
                    </p>
                  </div>
                </div>

                {order.customerNotes && (
                  <>
                    <Separator className="my-4" />
                    <div className="text-sm">
                      <p className="font-medium">Order Notes</p>
                      <p className="text-muted-foreground">
                        {order.customerNotes}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

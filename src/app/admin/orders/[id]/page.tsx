"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Truck, Calendar, User, Package2 } from "lucide-react";
import { useAdmin } from "@/lib/admin/admin-provider";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminHeader from "@/components/admin/admin-header";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
  variant?: {
    id: string;
    name: string;
    sku: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  subTotal: number;
  tax: number;
  shipping: number;
  createdAt: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { admin, isLoading } = useAdmin();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !admin) {
      router.push("/admin/login");
    }
  }, [admin, isLoading, router]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${(await params).id}`);
        if (!response.ok) throw new Error("Failed to fetch order details");
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to load order details");
      } finally {
        setOrderLoading(false);
      }
    };

    if (admin) {
      fetchOrder();
    }
  }, [admin, params]);

  // Handle status update
  const updateOrderStatus = async (newStatus: string) => {
    try {
      setOrderLoading(true);

      const response = await fetch(`/api/admin/orders/${(await params).id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order status");

      // Update local state
      if (order) {
        setOrder({ ...order, status: newStatus });
      }

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setOrderLoading(false);
    }
  };

  // Get badge color based on order status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Get payment status badge color
  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Format address
  const formatAddress = (address: Address) => {
    return (
      <>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{address.country}</p>
      </>
    );
  };

  // Loading state
  if (isLoading || orderLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  if (!order && !orderLoading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader title="Order Details" />
          <main className="flex-1 overflow-auto p-6">
            <Button
              variant="ghost"
              className="mb-6 flex items-center gap-1"
              onClick={() => router.push("/admin/orders")}
            >
              <ChevronLeft size={16} />
              Back to Orders
            </Button>
            <div className="flex h-80 items-center justify-center">
              <div className="text-center">
                <h2 className="mb-2 text-xl font-semibold">Order Not Found</h2>
                <p className="text-gray-500">
                  This order may have been deleted or doesn&apos;t exist.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader title="Order Details" />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Button
            variant="ghost"
            className="mb-6 flex items-center gap-1"
            onClick={() => router.push("/admin/orders")}
          >
            <ChevronLeft size={16} />
            Back to Orders
          </Button>

          {order && (
            <>
              {/* Order Header */}
              <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle>Order #{order.orderNumber}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Select
                          value={order.status}
                          onValueChange={updateOrderStatus}
                        >
                          <SelectTrigger className="h-8 w-[150px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">
                              Processing
                            </SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="mt-0.5 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-sm text-gray-500">
                            {order.user.email}
                          </p>
                          {order.user.phone && (
                            <p className="text-sm text-gray-500">
                              {order.user.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Package2 className="mt-0.5 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">
                            {order.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0,
                            )}{" "}
                            items
                          </p>
                          <p className="text-sm text-gray-500">
                            Total: ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Truck className="mt-0.5 h-5 w-5 text-gray-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Payment</p>
                            <Badge
                              className={getPaymentStatusBadgeColor(
                                order.paymentStatus,
                              )}
                            >
                              {order.paymentStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {formatAddress(order.shippingAddress)}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {formatAddress(order.billingAddress)}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 border-b pb-4 last:border-0 last:pb-0 sm:flex-row"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-gray-100">
                          {item.product.images[0] && (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 80px"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h4 className="font-medium">{item.product.name}</h4>
                            {item.variant && (
                              <p className="text-sm text-gray-500">
                                Variant: {item.variant.name} (SKU:{" "}
                                {item.variant.sku})
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm">
                              Qty:{" "}
                              <span className="font-medium">
                                {item.quantity}
                              </span>
                            </p>
                            <p className="font-medium">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${order.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>${order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

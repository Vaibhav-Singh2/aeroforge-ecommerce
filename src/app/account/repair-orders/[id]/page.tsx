"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Check, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { RepairDiagnosticSheet } from "@/components/account/repair-diagnostic-sheet";
import Image from "next/image";

// This would normally come from your API
type PartsUsed = {
  name: string;
  quantity: number;
  price: number;
};

type RepairOrder = {
  id: string;
  repairNumber: string;
  deviceType: string;
  deviceModel: string;
  deviceBrand?: string;
  status: string;
  issueDescription: string;
  diagnosisNotes?: string;
  repairNotes?: string;
  partsUsed?: PartsUsed[];
  estimatedCost: number | null;
  finalCost: number | null;
  paidAmount: number;
  createdAt: Date;
  quoteSentAt?: Date;
  quoteApprovedAt?: Date;
  completedAt?: Date;
  images?: string[];
  contactPhone?: string;
  customerNotes?: string;
};

export default function RepairOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<RepairOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch repair order details from the API
  useEffect(() => {
    const fetchRepairOrder = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/repair-orders/${(await params).id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Repair order not found");
          }
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        // Transform dates from strings to Date objects and parse JSON fields
        const orderData = data.repairOrder;

        // Parse JSON fields if needed
        const partsUsed = Array.isArray(orderData.partsUsed)
          ? orderData.partsUsed
          : [];

        const formattedOrder: RepairOrder = {
          ...orderData,
          createdAt: new Date(orderData.createdAt),
          quoteSentAt: orderData.quoteSentAt
            ? new Date(orderData.quoteSentAt)
            : undefined,
          quoteApprovedAt: orderData.quoteApprovedAt
            ? new Date(orderData.quoteApprovedAt)
            : undefined,
          completedAt: orderData.completedAt
            ? new Date(orderData.completedAt)
            : undefined,
          partsUsed: partsUsed as PartsUsed[],
        };

        setOrder(formattedOrder);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch repair order:", err);
        setError(
          "Failed to load repair order details. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepairOrder();
  }, [params]);

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

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p>Loading repair details...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <h2 className="mb-2 text-2xl font-semibold text-red-500">Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild>
          <Link href="/account/repair-orders">Back to Repair Orders</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <h2 className="mb-2 text-2xl font-semibold">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">
          {`We couldn't find the repair order you're looking for.`}
        </p>
        <Button asChild>
          <Link href="/account/repair-orders">Back to Repair Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-1 pb-5 md:px-5">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Repair #{order.repairNumber}
          </h1>
          <p className="text-muted-foreground">
            Submitted on {format(new Date(order.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
        <div className="ml-auto">{getStatusBadge(order.status)}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Repair Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Device Type
                  </dt>
                  <dd className="mt-1">{formatDeviceType(order.deviceType)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Brand
                  </dt>
                  <dd className="mt-1">
                    {order.deviceBrand || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Model
                  </dt>
                  <dd className="mt-1">{order.deviceModel}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Contact Phone
                  </dt>
                  <dd className="mt-1">
                    {order.contactPhone || "Not provided"}
                  </dd>
                </div>
              </dl>

              <Separator className="my-6" />

              <div>
                <h3 className="mb-2 font-medium">Issue Description</h3>
                <p className="text-muted-foreground">
                  {order.issueDescription}
                </p>
              </div>

              {order.customerNotes && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-2 font-medium">Customer Notes</h3>
                    <p className="text-muted-foreground">
                      {order.customerNotes}
                    </p>
                  </div>
                </>
              )}

              {order.diagnosisNotes && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-2 font-medium">Diagnosis</h3>
                    <p className="text-muted-foreground">
                      {order.diagnosisNotes}
                    </p>
                  </div>
                </>
              )}

              {order.repairNotes && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-2 font-medium">Repair Notes</h3>
                    <p className="text-muted-foreground">{order.repairNotes}</p>
                  </div>
                </>
              )}

              {order.images && order.images.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-3 font-medium">Images</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {order.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-md"
                        >
                          <Image
                            src={image}
                            alt={`Repair image ${index + 1}`}
                            className="h-full w-full object-cover"
                            width={500}
                            height={500}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Interactive Diagnostic Bench Sheet */}
          <RepairDiagnosticSheet
            repairNumber={order.repairNumber}
            deviceModel={order.deviceModel}
          />

          {order.partsUsed && order.partsUsed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Parts & Labor</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-right">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.partsUsed.map((part, i) => (
                      <tr key={i} className="py-2">
                        <td className="py-3">{part.name}</td>
                        <td className="py-3 text-right">{part.quantity}</td>
                        <td className="py-3 text-right">₹{part.price}</td>
                      </tr>
                    ))}
                    <tr className="font-medium">
                      <td className="pt-4">Labor</td>
                      <td className="pt-4 text-right"></td>
                      <td className="pt-4 text-right">
                        ₹
                        {order.estimatedCost! -
                          order.partsUsed!.reduce(
                            (sum: number, part: PartsUsed) => sum + part.price,
                            0,
                          )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">Status</span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    Submitted
                  </span>
                </div>
                <div>{format(new Date(order.createdAt), "MMM d, yyyy")}</div>
              </div>

              {order.quoteSentAt && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Quote Sent
                    </span>
                  </div>
                  <div>
                    {format(new Date(order.quoteSentAt), "MMM d, yyyy")}
                  </div>
                </div>
              )}

              {order.quoteApprovedAt && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Quote Approved
                    </span>
                  </div>
                  <div>
                    {format(new Date(order.quoteApprovedAt), "MMM d, yyyy")}
                  </div>
                </div>
              )}

              {order.completedAt && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Completed
                    </span>
                  </div>
                  <div>
                    {format(new Date(order.completedAt), "MMM d, yyyy")}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">Estimated Total</div>
                <div>₹{order.estimatedCost}</div>
              </div>

              {order.finalCost !== null && (
                <div className="flex items-center justify-between font-medium">
                  <div className="text-sm">Final Cost</div>
                  <div>₹{order.finalCost}</div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm">Paid Amount</div>
                <div>₹{order.paidAmount}</div>
              </div>

              {order.status === "QUOTE_SENT" && (
                <>
                  <Separator />
                  <div className="grid gap-2">
                    <Button className="w-full">Approve Quote</Button>
                    <Button variant="outline" className="w-full">
                      Contact Us
                    </Button>
                  </div>
                </>
              )}

              {order.status === "COMPLETED" &&
                order.paidAmount <
                  (order.finalCost || order.estimatedCost || 0) && (
                  <>
                    <Separator />
                    <Button className="w-full">Pay Balance</Button>
                  </>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

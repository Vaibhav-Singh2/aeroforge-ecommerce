import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Repair Order Details - Drone Store",
  description: "View details of your repair order",
};

// This page uses dynamic data, so we need to opt out of static rendering
export const dynamic = "force-dynamic";

async function getRepairOrderById(orderId: string) {
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

    // Get repair order details
    const repairOrder = await prisma.repairOrder.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
    });

    if (!repairOrder) {
      throw new Error("Repair order not found");
    }

    return repairOrder;
  } catch (error) {
    console.error("Failed to get repair order details:", error);
    throw new Error("Failed to get repair order details");
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

export default async function RepairOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const order = await getRepairOrderById(params.id); // Parse partsUsed from JSON if it exists
    const partsUsed = order.partsUsed
      ? (order.partsUsed as Array<{
          name: string;
          quantity: number;
          price: number;
        }>)
      : [];

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-10">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-2 flex items-center gap-1 px-0"
            asChild
          >
            <Link href="/account/repair-orders">
              <ArrowLeft className="h-4 w-4" />
              Back to Repair Orders
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            Repair Order #{order.repairNumber}
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Status Column */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-1">
                  <Badge
                    className={`w-fit ${getStatusBadgeColor(order.status)}`}
                    variant="outline"
                  >
                    {formatStatus(order.status)}
                  </Badge>
                  {order.createdAt && (
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Created:{" "}
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 h-4 w-4 rounded-full ${
                        true ? "bg-green-500" : "bg-gray-200"
                      }`}
                    >
                      {true && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Quote Requested</p>
                      <p className="text-muted-foreground text-xs">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 h-4 w-4 rounded-full ${
                        order.quoteSentAt ? "bg-green-500" : "bg-gray-200"
                      }`}
                    >
                      {order.quoteSentAt && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Quote Sent</p>
                      {order.quoteSentAt ? (
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(order.quoteSentAt), "MMM d, yyyy")}
                        </p>
                      ) : (
                        <p className="text-muted-foreground text-xs">Pending</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 h-4 w-4 rounded-full ${
                        order.quoteApprovedAt ? "bg-green-500" : "bg-gray-200"
                      }`}
                    >
                      {order.quoteApprovedAt && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Quote Approved</p>
                      {order.quoteApprovedAt ? (
                        <p className="text-muted-foreground text-xs">
                          {format(
                            new Date(order.quoteApprovedAt),
                            "MMM d, yyyy",
                          )}
                        </p>
                      ) : (
                        <p className="text-muted-foreground text-xs">Pending</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 h-4 w-4 rounded-full ${
                        [
                          "IN_PROGRESS",
                          "COMPLETED",
                          "READY_FOR_PICKUP",
                          "DELIVERED",
                        ].includes(order.status)
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    >
                      {[
                        "IN_PROGRESS",
                        "COMPLETED",
                        "READY_FOR_PICKUP",
                        "DELIVERED",
                      ].includes(order.status) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">In Progress</p>
                      {[
                        "IN_PROGRESS",
                        "COMPLETED",
                        "READY_FOR_PICKUP",
                        "DELIVERED",
                      ].includes(order.status) ? (
                        <p className="text-muted-foreground text-xs">
                          Started repair
                        </p>
                      ) : (
                        <p className="text-muted-foreground text-xs">Pending</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 h-4 w-4 rounded-full ${
                        order.completedAt ? "bg-green-500" : "bg-gray-200"
                      }`}
                    >
                      {order.completedAt && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      {order.completedAt ? (
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(order.completedAt), "MMM d, yyyy")}
                        </p>
                      ) : (
                        <p className="text-muted-foreground text-xs">Pending</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                {order.status === "QUOTE_SENT" && (
                  <div className="mt-4">
                    <Button className="w-full">Approve Quote</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Details Column */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Device Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground text-sm font-medium">
                      Device Type
                    </dt>
                    <dd className="text-sm">{order.deviceType}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-sm font-medium">
                      Model
                    </dt>
                    <dd className="text-sm">{order.deviceModel}</dd>
                  </div>
                  {order.deviceBrand && (
                    <div>
                      <dt className="text-muted-foreground text-sm font-medium">
                        Brand
                      </dt>
                      <dd className="text-sm">{order.deviceBrand}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground text-sm font-medium">
                      Contact Phone
                    </dt>
                    <dd className="text-sm">{order.contactPhone || "N/A"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Issue Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.issueDescription}</p>

                {order.images && order.images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Device Images
                    </h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {order.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square h-auto w-full overflow-hidden rounded-md border"
                        >
                          <Image
                            src={image}
                            alt={`Device image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {order.diagnosisNotes && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Diagnosis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line">
                    {order.diagnosisNotes}
                  </p>
                </CardContent>
              </Card>
            )}

            {order.repairNotes && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Repair Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line">
                    {order.repairNotes}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Cost Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {order.status === "QUOTE_REQUESTED" ? (
                  <p className="text-muted-foreground text-sm">
                    We are currently reviewing your repair request and will
                    provide a quote soon.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {partsUsed.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium">Parts Used</h4>
                        <table className="w-full text-sm">
                          <thead className="text-muted-foreground border-b text-xs">
                            <tr>
                              <th className="pb-2 text-left">Item</th>
                              <th className="pb-2 text-center">Qty</th>
                              <th className="pb-2 text-right">Price</th>
                              <th className="pb-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {partsUsed.map((part, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2">{part.name}</td>
                                <td className="py-2 text-center">
                                  {part.quantity}
                                </td>
                                <td className="py-2 text-right">
                                  ${part.price.toFixed(2)}
                                </td>
                                <td className="py-2 text-right">
                                  ${(part.quantity * part.price).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="space-y-2">
                      {order.estimatedCost !== null && (
                        <div className="flex justify-between text-sm">
                          <span>Estimated Cost:</span>
                          <span>${order.estimatedCost.toFixed(2)}</span>
                        </div>
                      )}

                      {order.finalCost !== null && (
                        <div className="flex justify-between text-sm font-medium">
                          <span>Final Cost:</span>
                          <span>${order.finalCost.toFixed(2)}</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between text-sm">
                        <span>Paid Amount:</span>
                        <span>${order.paidAmount.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between font-medium">
                        <span>Balance Due:</span>
                        <span>
                          $
                          {(
                            (order.finalCost ?? order.estimatedCost ?? 0) -
                            order.paidAmount
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {order.status === "READY_FOR_PICKUP" &&
                      order.paidAmount <
                        (order.finalCost ?? order.estimatedCost ?? 0) && (
                        <Button className="w-full">Pay Balance</Button>
                      )}
                  </div>
                )}

                {order.customerNotes && (
                  <div className="bg-muted/50 mt-4 rounded-md p-3">
                    <h4 className="text-muted-foreground mb-1 text-xs font-medium">
                      Your Notes
                    </h4>
                    <p className="text-sm">{order.customerNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching repair order details:", error);
    notFound();
  }
}

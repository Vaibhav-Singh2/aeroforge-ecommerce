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
  title: "Print Order Details - Drone Store",
  description: "View details of your 3D print order",
};

// This page uses dynamic data, so we need to opt out of static rendering
export const dynamic = "force-dynamic";

// Define types for print settings
type PrintSettings = {
  temperature?: string;
  bedTemperature?: string;
  cooling?: string;
  speed?: string;
  [key: string]: string | undefined;
};

async function getPrintOrderById(orderId: string) {
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

    // Get print order details
    const printOrder = await prisma.printOrder.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
    });

    if (!printOrder) {
      throw new Error("Print order not found");
    }

    return printOrder;
  } catch (error) {
    console.error("Failed to get print order details:", error);
    throw new Error("Failed to get print order details");
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

export default async function PrintOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const order = await getPrintOrderById(params.id);

    // Parse printSettings from JSON if it exists
    const printSettings = order.printSettings
      ? (order.printSettings as PrintSettings)
      : {};

    // Format the post-processing array for display
    const postProcessing = order.postProcessing || [];

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-10">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-2 flex items-center gap-1 px-0"
            asChild
          >
            <Link href="/account/print-orders">
              <ArrowLeft className="h-4 w-4" />
              Back to Print Orders
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            Print Order #{order.printNumber}
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
                  {order.isRush && (
                    <Badge
                      variant="outline"
                      className="w-fit bg-red-50 text-red-600"
                    >
                      Rush Order
                    </Badge>
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
                          "QUEUED",
                          "PRINTING",
                          "POST_PROCESSING",
                          "COMPLETED",
                          "READY_FOR_PICKUP",
                          "SHIPPED",
                          "DELIVERED",
                        ].includes(order.status)
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    >
                      {[
                        "QUEUED",
                        "PRINTING",
                        "POST_PROCESSING",
                        "COMPLETED",
                        "READY_FOR_PICKUP",
                        "SHIPPED",
                        "DELIVERED",
                      ].includes(order.status) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Queued</p>
                      {[
                        "QUEUED",
                        "PRINTING",
                        "POST_PROCESSING",
                        "COMPLETED",
                        "READY_FOR_PICKUP",
                        "SHIPPED",
                        "DELIVERED",
                      ].includes(order.status) ? (
                        <p className="text-muted-foreground text-xs">
                          Added to print queue
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
                          "PRINTING",
                          "POST_PROCESSING",
                          "COMPLETED",
                          "READY_FOR_PICKUP",
                          "SHIPPED",
                          "DELIVERED",
                        ].includes(order.status)
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    >
                      {[
                        "PRINTING",
                        "POST_PROCESSING",
                        "COMPLETED",
                        "READY_FOR_PICKUP",
                        "SHIPPED",
                        "DELIVERED",
                      ].includes(order.status) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Printing</p>
                      {order.printStartedAt ? (
                        <p className="text-muted-foreground text-xs">
                          {format(
                            new Date(order.printStartedAt),
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
                <CardTitle className="text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground text-sm font-medium">
                      Project Name
                    </dt>
                    <dd className="text-sm">{order.projectName}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-sm font-medium">
                      Quantity
                    </dt>
                    <dd className="text-sm">{order.quantity}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-sm font-medium">
                      Material
                    </dt>
                    <dd className="text-sm">{order.material}</dd>
                  </div>
                  {order.color && (
                    <div>
                      <dt className="text-muted-foreground text-sm font-medium">
                        Color
                      </dt>
                      <dd className="text-sm">{order.color}</dd>
                    </div>
                  )}

                  {order.infill !== null && order.infill !== undefined && (
                    <div>
                      <dt className="text-muted-foreground text-sm font-medium">
                        Infill
                      </dt>
                      <dd className="text-sm">{order.infill}%</dd>
                    </div>
                  )}

                  {order.layerHeight !== null &&
                    order.layerHeight !== undefined && (
                      <div>
                        <dt className="text-muted-foreground text-sm font-medium">
                          Layer Height
                        </dt>
                        <dd className="text-sm">{order.layerHeight}mm</dd>
                      </div>
                    )}

                  {order.printQuality && (
                    <div>
                      <dt className="text-muted-foreground text-sm font-medium">
                        Print Quality
                      </dt>
                      <dd className="text-sm">{order.printQuality}</dd>
                    </div>
                  )}

                  <div className="col-span-full">
                    <dt className="text-muted-foreground text-sm font-medium">
                      Special Requirements
                    </dt>
                    <dd className="mt-1 space-x-2 text-sm">
                      {order.needsSupports && (
                        <Badge variant="outline">Supports Required</Badge>
                      )}
                      {postProcessing.map((process, idx) => (
                        <Badge key={idx} variant="outline">
                          {process}
                        </Badge>
                      ))}
                      {!order.needsSupports && postProcessing.length === 0 && (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </dd>
                  </div>
                </dl>

                {order.description && (
                  <div className="mt-4">
                    <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                      Description
                    </h4>
                    <p className="text-sm">{order.description}</p>
                  </div>
                )}

                {order.fileUrls && order.fileUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Submitted Files
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {order.fileUrls.map((file, index) => {
                        const fileName =
                          file.split("/").pop() || `File ${index + 1}`;
                        return (
                          <li key={index}>
                            <a
                              href={file}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {fileName}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {order.images && order.images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Project Images
                    </h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {order.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square h-auto w-full overflow-hidden rounded-md border"
                        >
                          <Image
                            src={image}
                            alt={`Project image ${index + 1}`}
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

            {Object.keys(printSettings).length > 0 && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Print Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(printSettings).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-muted-foreground text-sm font-medium">
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/([A-Z])/g, " $1")}
                        </dt>
                        <dd className="text-sm">{value}</dd>
                      </div>
                    ))}
                  </dl>
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
                    We are currently reviewing your print request and will
                    provide a quote soon.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {order.materialCost !== null &&
                        order.materialCost !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span>Material Cost:</span>
                            <span>${order.materialCost.toFixed(2)}</span>
                          </div>
                        )}

                      {order.laborCost !== null &&
                        order.laborCost !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span>Labor Cost:</span>
                            <span>${order.laborCost.toFixed(2)}</span>
                          </div>
                        )}

                      {order.rushFee !== null &&
                        order.rushFee !== undefined &&
                        order.rushFee > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Rush Fee:</span>
                            <span>${order.rushFee.toFixed(2)}</span>
                          </div>
                        )}

                      <Separator />

                      <div className="flex justify-between text-sm font-medium">
                        <span>Total Cost:</span>
                        <span>
                          $
                          {order.totalCost
                            ? order.totalCost.toFixed(2)
                            : "0.00"}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Paid Amount:</span>
                        <span>${order.paidAmount.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between font-medium">
                        <span>Balance Due:</span>
                        <span>
                          $
                          {((order.totalCost || 0) - order.paidAmount).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    </div>

                    {order.status === "READY_FOR_PICKUP" &&
                      order.paidAmount < (order.totalCost || 0) && (
                        <Button className="w-full">Pay Balance</Button>
                      )}
                  </div>
                )}

                {/* Print estimates */}
                {(order.estimatedVolume !== null ||
                  order.estimatedWeight !== null ||
                  order.estimatedTime !== null) && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="mb-2 text-sm font-medium">
                      Print Estimates
                    </h4>
                    <dl className="grid gap-2 sm:grid-cols-3">
                      {order.estimatedVolume !== null &&
                        order.estimatedVolume !== undefined && (
                          <div>
                            <dt className="text-muted-foreground text-xs">
                              Volume
                            </dt>
                            <dd className="text-sm">
                              {order.estimatedVolume} cm³
                            </dd>
                          </div>
                        )}
                      {order.estimatedWeight !== null &&
                        order.estimatedWeight !== undefined && (
                          <div>
                            <dt className="text-muted-foreground text-xs">
                              Weight
                            </dt>
                            <dd className="text-sm">
                              {order.estimatedWeight} g
                            </dd>
                          </div>
                        )}
                      {order.estimatedTime !== null &&
                        order.estimatedTime !== undefined && (
                          <div>
                            <dt className="text-muted-foreground text-xs">
                              Print Time
                            </dt>
                            <dd className="text-sm">
                              {Math.floor(order.estimatedTime / 60)} hours{" "}
                              {order.estimatedTime % 60} min
                            </dd>
                          </div>
                        )}
                    </dl>
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
    console.error("Error fetching print order details:", error);
    notFound();
  }
}

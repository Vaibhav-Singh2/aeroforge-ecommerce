"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Check,
  Printer,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

// This would normally come from your API
type PrintOrder = {
  id: string;
  printNumber: string;
  projectName: string;
  description?: string;
  material: string;
  color?: string;
  quantity: number;
  infill?: number;
  layerHeight?: number;
  printQuality?: string;
  status: string;
  isRush: boolean;
  needsSupports: boolean;
  postProcessing: string[];
  estimatedVolume?: number;
  estimatedWeight?: number;
  estimatedTime?: number;
  materialCost?: number;
  laborCost?: number;
  rushFee?: number;
  totalCost: number | null;
  paidAmount: number;
  createdAt: Date;
  quoteSentAt?: Date;
  quoteApprovedAt?: Date;
  printStartedAt?: Date;
  completedAt?: Date;
  fileUrls?: string[];
  images?: string[];
  customerNotes?: string;
  printSettings?: any;
};

export default function PrintOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [order, setOrder] = useState<PrintOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - this would be replaced with an actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (params.id === "1") {
        setOrder({
          id: "1",
          printNumber: "PRT12345",
          projectName: "Custom Drone Frame",
          description:
            "Custom drone frame design with camera mount and battery compartment",
          material: "PLA",
          color: "Black",
          quantity: 1,
          infill: 50,
          layerHeight: 0.2,
          printQuality: "high",
          status: "PRINTING",
          isRush: false,
          needsSupports: true,
          postProcessing: ["sanding"],
          estimatedVolume: 130,
          estimatedWeight: 156,
          estimatedTime: 420,
          materialCost: 899,
          laborCost: 400,
          totalCost: 1299,
          paidAmount: 650,
          createdAt: new Date(2025, 5, 4), // June 4, 2025
          quoteSentAt: new Date(2025, 5, 5), // June 5, 2025
          quoteApprovedAt: new Date(2025, 5, 6), // June 6, 2025
          printStartedAt: new Date(2025, 5, 7), // June 7, 2025
          images: [
            "https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fDNkJTIwcHJpbnRlZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1631733517623-ca94d7c33e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGRyb25lJTIwZnJhbWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
          ],
          customerNotes:
            "Please make sure the landing gear mounts are reinforced",
          printSettings: {
            temperature: "210°C",
            bedTemperature: "60°C",
            cooling: "100%",
            speed: "40mm/s",
          },
        });
      } else if (params.id === "2") {
        setOrder({
          id: "2",
          printNumber: "PRT12346",
          projectName: "RC Car Parts Set",
          description: "Set of replacement parts for RC car",
          material: "PETG",
          color: "Red",
          quantity: 4,
          infill: 80,
          layerHeight: 0.15,
          printQuality: "high",
          status: "QUOTE_APPROVED",
          isRush: true,
          needsSupports: true,
          postProcessing: ["sanding", "painting"],
          rushFee: 200,
          materialCost: 499,
          laborCost: 200,
          totalCost: 899,
          paidAmount: 450,
          createdAt: new Date(2025, 5, 17), // June 17, 2025
          quoteSentAt: new Date(2025, 5, 18), // June 18, 2025
          quoteApprovedAt: new Date(2025, 5, 19), // June 19, 2025
        });
      } else {
        setOrder({
          id: "3",
          printNumber: "PRT12347",
          projectName: "Drone Landing Gear",
          description: "Flexible landing gear for drone",
          material: "TPU",
          color: "White",
          quantity: 2,
          infill: 30,
          layerHeight: 0.2,
          printQuality: "normal",
          status: "COMPLETED",
          isRush: false,
          needsSupports: false,
          postProcessing: [],
          materialCost: 399,
          laborCost: 200,
          totalCost: 599,
          paidAmount: 599,
          createdAt: new Date(2025, 5, 1), // June 1, 2025
          quoteSentAt: new Date(2025, 5, 2), // June 2, 2025
          quoteApprovedAt: new Date(2025, 5, 3), // June 3, 2025
          printStartedAt: new Date(2025, 5, 4), // June 4, 2025
          completedAt: new Date(2025, 5, 5), // June 5, 2025
          images: [
            "https://images.unsplash.com/photo-1527066236128-2ff79f7b9705?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFuZGluZyUyMGdlYXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
          ],
        });
      }
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

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

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p>Loading print details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <h2 className="mb-2 text-2xl font-semibold">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">
          {`We couldn't find the print order you're looking for.`}
        </p>
        <Button asChild>
          <Link href="/account/print-orders">Back to Print Orders</Link>
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
            Print #{order.printNumber}
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
              <CardTitle>Print Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Project
                  </dt>
                  <dd className="mt-1">{order.projectName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Material
                  </dt>
                  <dd className="mt-1">{formatMaterial(order.material)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Color
                  </dt>
                  <dd className="mt-1">{order.color || "Not specified"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Quantity
                  </dt>
                  <dd className="mt-1">{order.quantity}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Infill
                  </dt>
                  <dd className="mt-1">
                    {order.infill ? `${order.infill}%` : "Standard"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Layer Height
                  </dt>
                  <dd className="mt-1">
                    {order.layerHeight ? `${order.layerHeight}mm` : "Standard"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Print Quality
                  </dt>
                  <dd className="mt-1">
                    {order.printQuality
                      ? order.printQuality.charAt(0).toUpperCase() +
                        order.printQuality.slice(1)
                      : "Normal"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Post Processing
                  </dt>
                  <dd className="mt-1">
                    {order.postProcessing && order.postProcessing.length > 0
                      ? order.postProcessing
                          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                          .join(", ")
                      : "None"}
                  </dd>
                </div>
              </dl>

              {order.description && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-2 font-medium">Project Description</h3>
                    <p className="text-muted-foreground">{order.description}</p>
                  </div>
                </>
              )}

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

              {order.printSettings && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-3 font-medium">Print Settings</h3>
                    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {Object.entries(order.printSettings).map(
                        ([key, value]) => (
                          <div key={key}>
                            <dt className="text-muted-foreground text-xs font-medium">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </dt>
                            <dd className="text-sm">{value as string}</dd>
                          </div>
                        ),
                      )}
                    </dl>
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
                            alt={`Print image ${index + 1}`}
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

              {/* Additional options flags */}
              <Separator className="my-6" />
              <div>
                <h3 className="mb-3 font-medium">Additional Options</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Badge
                      className={
                        order.isRush
                          ? "bg-orange-500"
                          : "bg-slate-200 text-slate-500"
                      }
                    >
                      {order.isRush ? "Rush Order" : "Standard Processing"}
                    </Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge
                      className={
                        order.needsSupports
                          ? "bg-blue-500"
                          : "bg-slate-200 text-slate-500"
                      }
                    >
                      {order.needsSupports ? "With Supports" : "No Supports"}
                    </Badge>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
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

              {order.printStartedAt && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Printer className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Printing Started
                    </span>
                  </div>
                  <div>
                    {format(new Date(order.printStartedAt), "MMM d, yyyy")}
                  </div>
                </div>
              )}

              {order.completedAt && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Completed
                    </span>
                  </div>
                  <div>
                    {format(new Date(order.completedAt), "MMM d, yyyy")}
                  </div>
                </div>
              )}

              {/* Print Specs */}
              {(order.estimatedVolume ||
                order.estimatedWeight ||
                order.estimatedTime) && (
                <>
                  <Separator className="my-2" />
                  <div className="grid gap-2">
                    <div className="text-sm font-medium">
                      Print Specifications
                    </div>
                    {order.estimatedVolume && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="text-muted-foreground h-4 w-4" />
                          <span className="text-muted-foreground text-sm">
                            Volume
                          </span>
                        </div>
                        <div>{order.estimatedVolume} cm³</div>
                      </div>
                    )}
                    {order.estimatedWeight && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">
                            Weight
                          </span>
                        </div>
                        <div>{order.estimatedWeight} g</div>
                      </div>
                    )}
                    {order.estimatedTime && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="text-muted-foreground h-4 w-4" />
                          <span className="text-muted-foreground text-sm">
                            Print Time
                          </span>
                        </div>
                        <div>
                          {Math.floor(order.estimatedTime / 60)}h{" "}
                          {order.estimatedTime % 60}m
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {order.materialCost && (
                <div className="flex items-center justify-between">
                  <div className="text-sm">Material Cost</div>
                  <div>₹{order.materialCost}</div>
                </div>
              )}

              {order.laborCost && (
                <div className="flex items-center justify-between">
                  <div className="text-sm">Labor</div>
                  <div>₹{order.laborCost}</div>
                </div>
              )}

              {order.rushFee && order.rushFee > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm">Rush Fee</div>
                  <div>₹{order.rushFee}</div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between font-medium">
                <div className="text-sm">Total Cost</div>
                <div>₹{order.totalCost}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">Paid Amount</div>
                <div>₹{order.paidAmount}</div>
              </div>

              {order.totalCost && order.paidAmount < order.totalCost && (
                <div className="text-primary flex items-center justify-between font-medium">
                  <div className="text-sm">Remaining Balance</div>
                  <div>₹{order.totalCost - order.paidAmount}</div>
                </div>
              )}

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

              {order.paidAmount < (order.totalCost || 0) && (
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

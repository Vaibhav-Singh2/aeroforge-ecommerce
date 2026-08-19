"use client";

import { CheckCircle2, Clock, PackageCheck, Truck, ShieldCheck, Check } from "lucide-react";
import { OrderStatus } from "@prisma/client";

interface OrderTimelineStepperProps {
  status: OrderStatus;
  createdAt: Date | string;
  shippedAt?: Date | string | null;
  deliveredAt?: Date | string | null;
  trackingNumber?: string | null;
}

export function OrderTimelineStepper({
  status,
  createdAt,
  shippedAt,
  deliveredAt,
  trackingNumber,
}: OrderTimelineStepperProps) {
  // Determine step index: 0=Pending, 1=Confirmed, 2=Processing/Assembly, 3=Shipped, 4=Delivered
  let currentStep = 1;
  if (status === "PENDING") currentStep = 0;
  else if (status === "CONFIRMED") currentStep = 1;
  else if (status === "PROCESSING") currentStep = 2;
  else if (status === "SHIPPED") currentStep = 3;
  else if (status === "DELIVERED") currentStep = 4;

  const isCancelled = status === "CANCELLED" || status === "REFUNDED";

  const steps = [
    {
      title: "Order Placed",
      desc: "Order confirmed & verified",
      icon: Clock,
    },
    {
      title: "Hardware Flashing",
      desc: "Assembly & firmware benchmark",
      icon: ShieldCheck,
    },
    {
      title: "Quality Packed",
      desc: "ESD-safe secured packaging",
      icon: PackageCheck,
    },
    {
      title: "Air Express Dispatch",
      desc: trackingNumber ? `Tracking: ${trackingNumber}` : "In transit with courier",
      icon: Truck,
    },
    {
      title: "Delivered",
      desc: "Handed over to pilot",
      icon: CheckCircle2,
    },
  ];

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive">
        <strong className="block text-sm font-semibold">Order Status: {status}</strong>
        This order was cancelled or refunded. If you have questions, please reach out to AeroForge support.
      </div>
    );
  }

  return (
    <div className="w-full py-3">
      {/* Mobile/Desktop Stepper */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        {/* Horizontal Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-4 left-6 right-6 h-0.5 bg-muted z-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(Math.min(currentStep, 4) / 4) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className="relative z-10 flex md:flex-col items-center md:text-center gap-3 md:gap-2 flex-1"
            >
              {/* Step Circle Icon */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  isDone
                    ? "border-primary bg-primary text-primary-foreground shadow-xs"
                    : "border-muted bg-background text-muted-foreground"
                } ${isCurrent ? "ring-4 ring-primary/20 animate-pulse" : ""}`}
              >
                {isDone && idx < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>

              {/* Step Labels */}
              <div className="flex flex-col md:items-center">
                <span
                  className={`text-xs font-semibold ${
                    isDone ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
                <span className="text-[11px] text-muted-foreground max-w-[130px] line-clamp-1">
                  {step.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

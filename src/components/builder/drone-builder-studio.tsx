"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Wrench,
  Cpu,
  Zap,
  Radio,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Sparkles,
  RotateCcw,
  Gauge,
  Timer,
  Feather,
  Rocket,
  Check,
} from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addCartItem, openCart } from "@/lib/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// ─── Component Hardware Options ───────────────────────────────────────────────

interface BuilderPart {
  id: string;
  name: string;
  category: "frame" | "motors" | "stack" | "battery" | "camera";
  price: number;
  weightGrams: number;
  image: string;
  voltageClass: "4S" | "6S" | "ANY";
  sizeClass: "3.5" | "5.0" | "7.0";
  thrustGrams?: number; // Per motor
  kv?: number;
  capacityMah?: number;
  voltageNominal?: number;
  features: string[];
}

const FRAMES: BuilderPart[] = [
  {
    id: "frm-ttn5",
    name: "Titan-X 5-inch Chamfered Carbon Fiber Frame",
    category: "frame",
    price: 3499,
    weightGrams: 128,
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
    voltageClass: "ANY",
    sizeClass: "5.0",
    features: ["6mm Quick-Swap Toray 3K Arms", "CNC 7075 Aluminum Camera Mount", "225mm Wheelbase"],
  },
  {
    id: "frm-vtx35",
    name: "Vortex-35 3.5-inch Agile Freestyle Frame",
    category: "frame",
    price: 2699,
    weightGrams: 64,
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80",
    voltageClass: "ANY",
    sizeClass: "3.5",
    features: ["Sub-250g Optimization", "Duct Compatibility", "165mm Wheelbase"],
  },
  {
    id: "frm-phn7",
    name: "Phantom Apex 7-inch Long-Range Carbon Frame",
    category: "frame",
    price: 4899,
    weightGrams: 210,
    image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600&auto=format&fit=crop&q=80",
    voltageClass: "ANY",
    sizeClass: "7.0",
    features: ["Deadcat No-Props-in-View Geometry", "Dual Li-Ion Battery Bay", "320mm Wheelbase"],
  },
];

const MOTORS: BuilderPart[] = [
  {
    id: "mot-2207-6s",
    name: "AeroForge ApexDrive 2207.5 1950KV Brushless Motors (Set of 4)",
    category: "motors",
    price: 7596, // 4 * 1899
    weightGrams: 130, // 4 * 32.5
    thrustGrams: 1980,
    kv: 1950,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    voltageClass: "6S",
    sizeClass: "5.0",
    features: ["Titanium Grade 5 Hollow Shaft", "N52SH Arc Curved Magnets", "1980g Peak Thrust / Motor"],
  },
  {
    id: "mot-2207-4s",
    name: "AeroForge ApexDrive 2207.5 2550KV Brushless Motors (Set of 4)",
    category: "motors",
    price: 8796, // 4 * 2199
    weightGrams: 130,
    thrustGrams: 1750,
    kv: 2550,
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    voltageClass: "4S",
    sizeClass: "5.0",
    features: ["High RPM 4S Throttle Response", "Japanese NSK 9x4x4 Bearings", "1750g Peak Thrust / Motor"],
  },
  {
    id: "mot-1404-4s",
    name: "AeroForge MicroDrive 1404 3800KV Motors (Set of 4)",
    category: "motors",
    price: 5196,
    weightGrams: 36.8,
    thrustGrams: 480,
    kv: 3800,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    voltageClass: "4S",
    sizeClass: "3.5",
    features: ["Sub-250g Micro Lightweight", "High-Efficiency 3.5\" Props", "480g Peak Thrust / Motor"],
  },
];

const STACKS: BuilderPart[] = [
  {
    id: "stk-f7-55a",
    name: "Nexus F722 FC + 55A BlHeli_32 4-in-1 Stack",
    category: "stack",
    price: 9999,
    weightGrams: 24,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    voltageClass: "ANY",
    sizeClass: "5.0",
    features: ["Dual ICM-42688-P Gyros", "128kHz PWM DShot1200", "DJI HD Plug-and-Play Port"],
  },
  {
    id: "stk-f7-60a",
    name: "AeroStack Pro F722 + 60A Heavy-Duty Stack",
    category: "stack",
    price: 11499,
    weightGrams: 29,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80",
    voltageClass: "ANY",
    sizeClass: "5.0",
    features: ["Toshiba MOSFETs + CNC Heatshield", "8 Motor PWM Outputs", "16MB Blackbox Flash"],
  },
  {
    id: "stk-f4-aio",
    name: "AIO F411 20A Ultralight Micro Flight Controller",
    category: "stack",
    price: 4499,
    weightGrams: 8.5,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    voltageClass: "4S",
    sizeClass: "3.5",
    features: ["Integrated 20A ESC on single board", "25.5x25.5mm Whoop Mount", "Built-in OSD"],
  },
];

const BATTERIES: BuilderPart[] = [
  {
    id: "bat-6s-1400",
    name: "GraphenePower 6S 1400mAh 150C High-Discharge LiPo",
    category: "battery",
    price: 3199,
    weightGrams: 220,
    capacityMah: 1400,
    voltageNominal: 22.2,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    voltageClass: "6S",
    sizeClass: "5.0",
    features: ["Zero Voltage Sag under Full Throttle", "Amass XT60 Connector", "150C Burst 300C"],
  },
  {
    id: "bat-6s-1550",
    name: "GraphenePower 6S 1550mAh 150C Extended Flight LiPo",
    category: "battery",
    price: 3699,
    weightGrams: 245,
    capacityMah: 1550,
    voltageNominal: 22.2,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    voltageClass: "6S",
    sizeClass: "5.0",
    features: ["Extended Cruise Capacity", "Graphene Matrix Layering", "Amass XT60 Connector"],
  },
  {
    id: "bat-4s-850",
    name: "GraphenePower 4S 850mAh 120C Lightweight Pack",
    category: "battery",
    price: 1999,
    weightGrams: 105,
    capacityMah: 850,
    voltageNominal: 14.8,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    voltageClass: "4S",
    sizeClass: "3.5",
    features: ["Sub-250g Class Optimization", "XT30 Connector", "120C Discharge"],
  },
];

const CAMERAS: BuilderPart[] = [
  {
    id: "cam-dji-o3",
    name: "DJI O3 Air Unit 4K 60fps HD Digital Transmission System",
    category: "camera",
    price: 18999,
    weightGrams: 36.4,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    voltageClass: "ANY",
    sizeClass: "5.0",
    features: ["4K 60fps stabilized onboard recording", "1080p 100fps H.265 video link", "Sub-28ms Latency"],
  },
  {
    id: "cam-walksnail",
    name: "Walksnail Avatar HD Micro V2 Digital System",
    category: "camera",
    price: 12499,
    weightGrams: 22.5,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    voltageClass: "ANY",
    sizeClass: "5.0",
    features: ["1080p OLED low-latency feed", "32GB Onboard Memory", "Dual Antennas"],
  },
  {
    id: "cam-analog",
    name: "RunCam Nano 4 Low-Latency Starlight Analog FPV Camera",
    category: "camera",
    price: 2499,
    weightGrams: 6.8,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    voltageClass: "ANY",
    sizeClass: "ANY" as any,
    features: ["1200TVL Resolution", "0.001 Lux Night Sensitivity", "Ultra-Lightweight 6.8g"],
  },
];

export function DroneBuilderStudio() {
  const dispatch = useAppDispatch();

  // Builder Selections
  const [selectedFrame, setSelectedFrame] = useState<BuilderPart>(FRAMES[0]);
  const [selectedMotors, setSelectedMotors] = useState<BuilderPart>(MOTORS[0]);
  const [selectedStack, setSelectedStack] = useState<BuilderPart>(STACKS[0]);
  const [selectedBattery, setSelectedBattery] = useState<BuilderPart>(BATTERIES[0]);
  const [selectedCamera, setSelectedCamera] = useState<BuilderPart>(CAMERAS[0]);

  // Active step tab
  const [activeStep, setActiveStep] = useState<"frame" | "motors" | "stack" | "battery" | "camera">("frame");

  // ─── Real-Time Physics Telemetry Engine ──────────────────────────────────────
  const telemetry = useMemo(() => {
    const hardwareWeight =
      selectedFrame.weightGrams +
      selectedMotors.weightGrams +
      selectedStack.weightGrams +
      selectedBattery.weightGrams +
      selectedCamera.weightGrams +
      22; // 22g for 4x Propellers + Hardware Screws + TPU Mounts

    const totalStaticThrust = (selectedMotors.thrustGrams || 1500) * 4;
    const twRatio = Number((totalStaticThrust / hardwareWeight).toFixed(1));

    // Performance characterization
    let flightCharacter = "Freestyle Balanced";
    let agilityScore = 75;
    if (twRatio >= 8.5) {
      flightCharacter = "Hyper-Acrobatic Extreme Racing";
      agilityScore = 98;
    } else if (twRatio >= 6.0) {
      flightCharacter = "Snappy Freestyle & Cinematic";
      agilityScore = 85;
    } else {
      flightCharacter = "Cinematic Long-Range Expedition";
      agilityScore = 60;
    }

    // Estimated top speed in km/h based on KV and battery voltage
    const nominalVoltage = selectedBattery.voltageNominal || 22.2;
    const kv = selectedMotors.kv || 1950;
    const rpmMax = kv * nominalVoltage * 0.85;
    const topSpeedKmh = Math.round((rpmMax * 4.5 * 0.0016 * 60) / 100);

    // Estimated hover flight time
    const batteryWh = ((selectedBattery.capacityMah || 1400) / 1000) * nominalVoltage;
    const hoverWattage = hardwareWeight * 0.17; // 0.17 W per gram hover efficiency
    const flightTimeMinutes = Number(((batteryWh / hoverWattage) * 60).toFixed(1));

    // Voltage Compatibility Check
    const voltageMismatch =
      (selectedMotors.voltageClass === "6S" && selectedBattery.voltageClass === "4S") ||
      (selectedMotors.voltageClass === "4S" && selectedBattery.voltageClass === "6S");

    // Total Bundle Price
    const rawTotalPrice =
      selectedFrame.price +
      selectedMotors.price +
      selectedStack.price +
      selectedBattery.price +
      selectedCamera.price;

    const bundleDiscount = Math.round(rawTotalPrice * 0.08); // 8% Custom Build Bundle Discount
    const finalBundlePrice = rawTotalPrice - bundleDiscount;

    return {
      hardwareWeight,
      totalStaticThrust,
      twRatio,
      flightCharacter,
      agilityScore,
      topSpeedKmh,
      flightTimeMinutes,
      voltageMismatch,
      rawTotalPrice,
      bundleDiscount,
      finalBundlePrice,
    };
  }, [selectedFrame, selectedMotors, selectedStack, selectedBattery, selectedCamera]);

  // Handle Bundle Add-to-Cart
  const handleAddBundleToCart = () => {
    const parts = [selectedFrame, selectedMotors, selectedStack, selectedBattery, selectedCamera];

    for (const part of parts) {
      dispatch(
        addCartItem({
          id: `builder-${part.id}-${Date.now()}`,
          productId: part.id,
          quantity: 1,
          product: {
            id: part.id,
            name: `[Custom Build] ${part.name}`,
            slug: part.id,
            price: Math.round(part.price * 0.92), // 8% bundle savings applied
            description: "Custom Drone Builder Studio Spec Item",
            sku: `BLD-${part.id.toUpperCase()}`,
            images: [part.image],
            tags: ["custom-build", "aero-build"],
            isFeature: false,
            isBestseller: false,
            trackQuantity: true,
            quantity: 20,
            weight: part.weightGrams,
            status: "ACTIVE" as any,
            categoryId: "",
            specifications: null,
            compatibleParts: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as any,
        }),
      );
    }

    dispatch(openCart());
  };

  const steps = [
    { id: "frame", title: "1. Carbon Frame", icon: Wrench, current: selectedFrame },
    { id: "motors", title: "2. Brushless Motors (x4)", icon: Zap, current: selectedMotors },
    { id: "stack", title: "3. Flight Controller Stack", icon: Cpu, current: selectedStack },
    { id: "battery", title: "4. High-C LiPo Battery", icon: Radio, current: selectedBattery },
    { id: "camera", title: "5. FPV Camera & VTX", icon: Eye, current: selectedCamera },
  ];

  return (
    <div className="container max-w-7xl py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Rocket className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              AeroBuild™ FPV Drone Studio
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5">
            Assemble your custom high-performance UAV with real-time aerodynamics and thrust physics calculation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-3 py-1 font-mono gap-1.5 border-primary/40 bg-primary/5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>8% Bundle Discount Applied</span>
          </Badge>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Side: Step-by-Step Hardware Configurator */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b scrollbar-none touch-pan-x -mx-1 px-1">
            {steps.map((step) => {
              const isSelected = activeStep === step.id;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id as any)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Selection Grid */}
          <div className="space-y-4">
            {activeStep === "frame" && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">Choose Drone Frame:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {FRAMES.map((part) => (
                    <PartSelectionCard
                      key={part.id}
                      part={part}
                      isSelected={selectedFrame.id === part.id}
                      onSelect={() => {
                        setSelectedFrame(part);
                        setActiveStep("motors");
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeStep === "motors" && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">Choose Brushless Motor Quad-Pack:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {MOTORS.map((part) => (
                    <PartSelectionCard
                      key={part.id}
                      part={part}
                      isSelected={selectedMotors.id === part.id}
                      onSelect={() => {
                        setSelectedMotors(part);
                        setActiveStep("stack");
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeStep === "stack" && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">Choose Flight Controller & ESC Stack:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {STACKS.map((part) => (
                    <PartSelectionCard
                      key={part.id}
                      part={part}
                      isSelected={selectedStack.id === part.id}
                      onSelect={() => {
                        setSelectedStack(part);
                        setActiveStep("battery");
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeStep === "battery" && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">Choose LiPo Battery Pack:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {BATTERIES.map((part) => (
                    <PartSelectionCard
                      key={part.id}
                      part={part}
                      isSelected={selectedBattery.id === part.id}
                      onSelect={() => {
                        setSelectedBattery(part);
                        setActiveStep("camera");
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeStep === "camera" && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">Choose Digital HD or Analog FPV Camera:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {CAMERAS.map((part) => (
                    <PartSelectionCard
                      key={part.id}
                      part={part}
                      isSelected={selectedCamera.id === part.id}
                      onSelect={() => setSelectedCamera(part)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Physics Telemetry & Pricing Dashboard */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <Card className="rounded-2xl border shadow-xl bg-card/70 backdrop-blur-md overflow-hidden">
            <div className="bg-muted/40 p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Live Physics & Flight Telemetry
                </span>
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono">
                {telemetry.flightCharacter}
              </Badge>
            </div>

            <CardContent className="p-5 space-y-5">
              {/* Compatibility Warnings */}
              {telemetry.voltageMismatch && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 flex items-start gap-2.5 text-xs text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Voltage Mismatch Detected:</strong>
                    You have paired {selectedMotors.voltageClass} Motors with a {selectedBattery.voltageClass} Battery. Match them for optimal flight performance.
                  </div>
                </div>
              )}

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border bg-muted/20 p-3.5 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Feather className="h-3.5 w-3.5 text-primary" />
                    All-Up Weight (AUW)
                  </span>
                  <p className="text-xl font-extrabold text-foreground font-mono">
                    {telemetry.hardwareWeight}g
                  </p>
                  <span className="text-[10px] text-muted-foreground">Incl. props & hardware</span>
                </div>

                <div className="rounded-xl border bg-muted/20 p-3.5 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Rocket className="h-3.5 w-3.5 text-primary" />
                    Thrust-to-Weight
                  </span>
                  <p className="text-xl font-extrabold text-primary font-mono">
                    {telemetry.twRatio} : 1
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {telemetry.totalStaticThrust}g Total Thrust
                  </span>
                </div>

                <div className="rounded-xl border bg-muted/20 p-3.5 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-primary" />
                    Est. Top Speed
                  </span>
                  <p className="text-xl font-extrabold text-foreground font-mono">
                    {telemetry.topSpeedKmh} km/h
                  </p>
                  <span className="text-[10px] text-muted-foreground">Max throttle level flight</span>
                </div>

                <div className="rounded-xl border bg-muted/20 p-3.5 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5 text-primary" />
                    Est. Hover Time
                  </span>
                  <p className="text-xl font-extrabold text-foreground font-mono">
                    ~{telemetry.flightTimeMinutes} mins
                  </p>
                  <span className="text-[10px] text-muted-foreground">Continuous steady hover</span>
                </div>
              </div>

              {/* Agility Power Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Acrobatic Response Rating:</span>
                  <span className="text-primary font-mono">{telemetry.agilityScore}%</span>
                </div>
                <Progress value={telemetry.agilityScore} className="h-2" />
              </div>

              {/* Financial Breakdown & Bundle Button */}
              <div className="border-t pt-4 space-y-3">
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Individual Parts Sum:</span>
                    <span className="font-mono">₹{telemetry.rawTotalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                    <span>AeroBuild Bundle Savings (-8%):</span>
                    <span className="font-mono">-₹{telemetry.bundleDiscount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-foreground border-t pt-2">
                    <span>Complete Custom Kit:</span>
                    <span className="font-mono text-primary text-xl">
                      ₹{telemetry.finalBundlePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2 text-sm font-bold shadow-lg"
                  onClick={handleAddBundleToCart}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add Entire Build to Cart</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Single Part Card Component ───────────────────────────────────────────────
function PartSelectionCard({
  part,
  isSelected,
  onSelect,
}: {
  part: BuilderPart;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-4 rounded-xl border p-3.5 cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-md"
          : "hover:border-primary/40 hover:bg-muted/40 bg-card"
      }`}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
        <Image
          src={part.image}
          alt={part.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-foreground truncate">{part.name}</p>
          <span className="text-xs font-extrabold text-foreground font-mono shrink-0">
            ₹{part.price.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {part.features.map((f, i) => (
            <span
              key={i}
              className="text-[10px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded border"
            >
              {f}
            </span>
          ))}
          <span className="text-[10px] font-mono text-primary font-semibold px-1.5 py-0.5">
            {part.weightGrams}g
          </span>
        </div>
      </div>

      <div className="shrink-0">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
            isSelected ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground/30"
          }`}
        >
          {isSelected && <Check className="h-3.5 w-3.5" />}
        </div>
      </div>
    </div>
  );
}

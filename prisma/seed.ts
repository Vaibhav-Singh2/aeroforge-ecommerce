import {
  PrismaClient,
  ProductType,
  ProductStatus,
  PrintStatus,
  PrintMaterial,
  RepairStatus,
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── High-Reliability Curated Image Assets (Unsplash CDN) ─────────────────────
// Verified aerospace, drone, RC plane, electronics, 3D printing & tooling photos
const IMAGES = {
  racingDrones: [
    "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
  ],
  photoDrones: [
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1200&q=80",
  ],
  rcPlanes: [
    "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
  ],
  microDrones: [
    "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524143986875-3b098d78b363?auto=format&fit=crop&w=1200&q=80",
  ],
  commercialUAV: [
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507582020432-2a3bc4ff7a8b?auto=format&fit=crop&w=1200&q=80",
  ],
  motors: [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  ],
  flightControllers: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
  ],
  frames: [
    "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80",
  ],
  batteries: [
    "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80",
  ],
  cameras: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
  ],
  transmitters: [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
  ],
  filaments: [
    "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1200&q=80",
  ],
  tools: [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  ],
};

// ─── Category Definitions ─────────────────────────────────────────────────────

const categoriesData = [
  // READY_MADE_PROJECT
  {
    name: "Racing & FPV Drones",
    slug: "racing-drones",
    description:
      "High-speed FPV racing and freestyle quadcopters engineered for sub-millisecond response, agile maneuverability, and HD digital transmission.",
    imageUrl: IMAGES.racingDrones[0],
    type: ProductType.READY_MADE_PROJECT,
    isActive: true,
  },
  {
    name: "Aerial Photography UAVs",
    slug: "photography-drones",
    description:
      "Cinema-grade drones equipped with 3-axis stabilized gimbals, 4K/8K sensors, and omnidirectional obstacle avoidance.",
    imageUrl: IMAGES.photoDrones[0],
    type: ProductType.READY_MADE_PROJECT,
    isActive: true,
  },
  {
    name: "RC Airplanes & Wings",
    slug: "rc-planes",
    description:
      "Aerobatic fixed-wing aircraft, high-thrust EDF jets, and long-range delta wings for sport and FPV cruising.",
    imageUrl: IMAGES.rcPlanes[0],
    type: ProductType.READY_MADE_PROJECT,
    isActive: true,
  },
  {
    name: "Micro & Cinewhoop Drones",
    slug: "mini-micro-drones",
    description:
      "Duct-protected cinewhoops and sub-250g micro quads designed for safe indoor filmmaking and tight gap exploration.",
    imageUrl: IMAGES.microDrones[0],
    type: ProductType.READY_MADE_PROJECT,
    isActive: true,
  },
  {
    name: "Autonomous Commercial UAVs",
    slug: "commercial-uavs",
    description:
      "Enterprise mapping, LiDAR survey, and precision agriculture drone systems with RTK centimeter-accurate positioning.",
    imageUrl: IMAGES.commercialUAV[0],
    type: ProductType.READY_MADE_PROJECT,
    isActive: true,
  },

  // PART_AND_ACCESSORY
  {
    name: "Brushless Motors & ESCs",
    slug: "motors-escs",
    description:
      "High-KV brushless motors, 4-in-1 BlHeli_32/AM32 ESC stacks, and cooling accessories for peak thrust output.",
    imageUrl: IMAGES.motors[0],
    type: ProductType.PART_AND_ACCESSORY,
    isActive: true,
  },
  {
    name: "Flight Controllers & Avionics",
    slug: "flight-controllers",
    description:
      "F7 & H7 processor flight controllers, dual-gyro dampening systems, power distribution boards, and blackbox loggers.",
    imageUrl: IMAGES.flightControllers[0],
    type: ProductType.PART_AND_ACCESSORY,
    isActive: true,
  },
  {
    name: "Carbon Frames & Propellers",
    slug: "propellers-frames",
    description:
      "Toray 3K/T700 carbon fiber frames, aerodynamic multi-blade polycarbonate props, and titanium hardware kits.",
    imageUrl: IMAGES.frames[0],
    type: ProductType.PART_AND_ACCESSORY,
    isActive: true,
  },
  {
    name: "LiPo Batteries & Fast Chargers",
    slug: "batteries-chargers",
    description:
      "High-discharge graphene 4S/6S LiPo packs, dual-channel smart balance chargers, and LiPo safe storage cases.",
    imageUrl: IMAGES.batteries[0],
    type: ProductType.PART_AND_ACCESSORY,
    isActive: true,
  },
  {
    name: "FPV Cameras & Video Systems",
    slug: "fpv-cameras-goggles",
    description:
      "Low-latency digital HD video transmitters, ultra-wide starlight FPV cameras, patch antennas, and OLED FPV goggles.",
    imageUrl: IMAGES.cameras[0],
    type: ProductType.PART_AND_ACCESSORY,
    isActive: true,
  },
  {
    name: "Radio Transmitters & Receivers",
    slug: "transmitters-receivers",
    description:
      "ExpressLRS 2.4GHz/900MHz transmitters, Hall-effect gimbal radios, diversity receivers, and telemetry modules.",
    imageUrl: IMAGES.transmitters[0],
    type: ProductType.PART_AND_ACCESSORY,
    isActive: true,
  },
  {
    name: "3D Filaments & Resins",
    slug: "3d-printing-filaments",
    description:
      "Engineering-grade carbon fiber PETG, high-temp ABS, flexible TPU 95A, and precision casting resins for prototyping.",
    imageUrl: IMAGES.filaments[0],
    type: ProductType.PART_AND_ACCESSORY,
    isActive: true,
  },
  {
    name: "Diagnostics & Workshop Tools",
    slug: "tools-and-diagnostics",
    description:
      "Digital multi-meters, RF power meters, TS101 soldering irons, smoke stoppers, and hex driver precision toolkits.",
    imageUrl: IMAGES.tools[0],
    type: ProductType.PART_AND_ACCESSORY,
    isActive: true,
  },
];

// ─── Dynamic Product Master Templates ─────────────────────────────────────────

type ProductSeed = {
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  weight?: number;
  images: string[];
  tags: string[];
  isFeature: boolean;
  isBestseller: boolean;
  specifications: Record<string, string | number | boolean>;
  categorySlug: string;
  variants?: {
    name: string;
    sku: string;
    price?: number;
    quantity: number;
    image?: string;
  }[];
};

const productsData: ProductSeed[] = [
  // ── 1. Racing & FPV Drones ──────────────────────────────────────────────────
  {
    name: "AeroForge X-500 Carbon Pro 5-inch FPV Racing Quad",
    slug: "aeroforge-x500-carbon-pro-5inch",
    description:
      "Engineered for competitive FPV circuits, the X-500 Carbon Pro features a 6mm Toray 3K chamfered carbon frame, 2207 1950KV brushless motors, and an integrated DJI O3 HD digital transmission unit capable of reaching speeds up to 130 mph with sub-28ms video latency.",
    sku: "AFL-X500-5IN-HD",
    price: 44999,
    quantity: 24,
    weight: 385,
    images: [IMAGES.racingDrones[0], IMAGES.racingDrones[1]],
    tags: ["fpv", "racing", "5-inch", "dji-o3", "carbon-fiber", "bnf", "aeroforge"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "racing-drones",
    specifications: {
      "Frame Type": "True-X 5-inch 3K Carbon Fiber",
      Motors: "AeroForge 2207 1950KV Brushless",
      "FC Stack": "F722 Dual Gyro + 55A 32-bit ESC",
      "Video System": "DJI O3 Air Unit (4K 60fps)",
      "Top Speed": "130 mph / 209 km/h",
      "Input Voltage": "6S LiPo (22.2V - 25.2V)",
      "Flight Time": "5-8 minutes",
      Weight: "385g (excl. battery)",
    },
    variants: [
      {
        name: "6S BNF (Bind-and-Fly / No Radio)",
        sku: "AFL-X500-5IN-BNF-6S",
        price: 44999,
        quantity: 16,
      },
      {
        name: "6S RTF (Includes RadioMaster TX16S Radio + 2x LiPo)",
        sku: "AFL-X500-5IN-RTF-6S",
        price: 68999,
        quantity: 8,
      },
    ],
  },
  {
    name: "Vortex 3.5 Freestyle Agile Quad",
    slug: "vortex-35-freestyle-agile-quad",
    description:
      "A lightweight 3.5-inch freestyle drone that blends the agility of a micro quad with the momentum of a full 5-inch rig. Built with 1404 3800KV motors for snappy throttle response and cinematic park flying.",
    sku: "AFL-VTX-35-FR",
    price: 24999,
    quantity: 30,
    weight: 165,
    images: [IMAGES.racingDrones[1], IMAGES.racingDrones[2]],
    tags: ["freestyle", "3.5-inch", "lightweight", "analog", "sub250g"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "racing-drones",
    specifications: {
      "Frame Size": "3.5 inch",
      Motors: "1404 3800KV",
      "FC Stack": "AIO F411 20A",
      "Video Link": "Walksnail Avatar HD Mini",
      "Input Voltage": "4S LiPo",
      "All-Up Weight": "240g with 4S 650mAh",
    },
  },
  {
    name: "Phantom Apex 7-inch Long-Range FPV Explorer",
    slug: "phantom-apex-7inch-long-range",
    description:
      "Designed for mountain surfing and long-range cinematic expeditions, the Phantom Apex 7-inch carries large Li-Ion battery packs for up to 28 minutes of continuous flight while maintaining GPS rescue capabilities.",
    sku: "AFL-PHN-7IN-LR",
    price: 52999,
    quantity: 12,
    weight: 620,
    images: [IMAGES.racingDrones[2], IMAGES.racingDrones[0]],
    tags: ["long-range", "7-inch", "gps", "cinematic", "mountain-surf"],
    isFeature: true,
    isBestseller: false,
    categorySlug: "racing-drones",
    specifications: {
      "Frame Size": "7 inch DeadCat",
      Motors: "2806.5 1300KV",
      "GPS Module": "M10Q-5883 Compass",
      "Flight Time": "25-28 minutes on 6S 4000mAh",
      "Max Range": "12 km line of sight",
    },
  },

  // ── 2. Aerial Photography UAVs ──────────────────────────────────────────────
  {
    name: "SkyMaster Horizon 8K Cinematic Aerial Platform",
    slug: "skymaster-horizon-8k-cinematic",
    description:
      "A flagship photography and filmmaking UAV with a 1-inch CMOS sensor, 8K 30fps / 4K 120fps video recording, 10-bit D-Log M color profile, and 45 minutes of stable hovering time with 360-degree LiDAR obstacle sensing.",
    sku: "AFL-SKY-HZ-8K",
    price: 89999,
    quantity: 15,
    weight: 890,
    images: [IMAGES.photoDrones[0], IMAGES.photoDrones[1]],
    tags: ["photography", "8k", "cinema", "lidar", "gimbal", "4k120"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "photography-drones",
    specifications: {
      "Camera Sensor": "1-inch 48MP CMOS",
      "Video Resolution": "8K @ 30fps / 4K @ 120fps",
      Gimbal: "3-Axis Mechanical Stabilization",
      "Max Flight Time": "45 minutes",
      "Obstacle Sensing": "Omnidirectional LiDAR + Dual Vision",
      "Transmission Range": "15 km HD O3+",
    },
    variants: [
      {
        name: "Standard Pack (Drone + 1 Battery + Smart Remote)",
        sku: "AFL-SKY-HZ-8K-STD",
        price: 89999,
        quantity: 10,
      },
      {
        name: "Fly More Combo (3 Batteries + Hub + ND Filter Set + Case)",
        sku: "AFL-SKY-HZ-8K-FLYMORE",
        price: 114999,
        quantity: 5,
      },
    ],
  },
  {
    name: "AeroLens Pro 4K Travel Folding Drone",
    slug: "aerolens-pro-4k-travel-drone",
    description:
      "Ultra-compact folding quadcopter under 249 grams that doesn't compromise on optical quality. Features a 1/1.3-inch sensor, 4K HDR video, true vertical shooting for social media, and level 5 wind resistance.",
    sku: "AFL-LNS-4K-TRV",
    price: 38999,
    quantity: 35,
    weight: 246,
    images: [IMAGES.photoDrones[1], IMAGES.photoDrones[2]],
    tags: ["travel", "folding", "sub250g", "4k-hdr", "vertical-video"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "photography-drones",
    specifications: {
      Weight: "246g (Sub-249g Category)",
      Resolution: "4K HDR @ 60fps",
      "Flight Time": "34 minutes",
      "Wind Resistance": "10.7 m/s (Scale 5)",
    },
  },

  // ── 3. RC Airplanes & Wings ─────────────────────────────────────────────────
  {
    name: "AeroSwept V2 1200mm Long-Range FPV Flying Wing",
    slug: "aeroswept-v2-1200mm-fpv-wing",
    description:
      "Molded from durable EPP foam with carbon fiber spar reinforcement, the AeroSwept V2 is an aerodynamically optimized delta wing capable of 45+ minute cruising speeds and rock-steady automated waypoint navigation via ArduPilot / INAV.",
    sku: "AFL-ASW-V2-1200",
    price: 18999,
    quantity: 20,
    weight: 750,
    images: [IMAGES.rcPlanes[0], IMAGES.rcPlanes[1]],
    tags: ["rc-plane", "flying-wing", "fpv", "inav", "epp-foam", "long-range"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "rc-planes",
    specifications: {
      Wingspan: "1200mm (47.2 in)",
      Material: "High-Density EPP with Carbon Spars",
      Motor: "2216 1400KV Outrunner",
      ESC: "50A with 5V/5A Switching BEC",
      "Cruise Speed": "65 km/h",
      "Max Speed": "145 km/h",
      "Flight Time": "45-60 minutes on 4S 5000mAh",
    },
  },
  {
    name: "ThunderJet 70mm EDF Aerobatic Fighter Jet",
    slug: "thunderjet-70mm-edf-fighter",
    description:
      "A scale 70mm 12-blade Electric Ducted Fan (EDF) jet replicating modern fighter avionics. Delivers turbine-like acoustics, functional electric retracts with metal shock-absorbing struts, and crisp roll rates.",
    sku: "AFL-THJ-70-EDF",
    price: 28999,
    quantity: 14,
    weight: 1850,
    images: [IMAGES.rcPlanes[1], IMAGES.rcPlanes[2]],
    tags: ["edf-jet", "scale-airplane", "70mm", "retracts", "high-speed"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "rc-planes",
    specifications: {
      "EDF Unit": "70mm 12-Blade Ducted Fan",
      Motor: "2860 2200KV Inrunner",
      ESC: "80A Brushless with XT90",
      Retracts: "All-metal CNC shock absorbing",
      "Battery Requirement": "6S 3300mAh - 4000mAh LiPo",
    },
  },

  // ── 4. Micro & Cinewhoop Drones ─────────────────────────────────────────────
  {
    name: "CineSafe 25 HD Ducted Indoor Whoop",
    slug: "cinesafe-25-hd-ducted-whoop",
    description:
      "An ultra-safe 2.5-inch cinewhoop with molded prop guards, soft TPU bumpers, and DJI O3 digital video. Perfect for high-definition close-proximity indoor filming around people and delicate interiors.",
    sku: "AFL-CS-25-HD",
    price: 32999,
    quantity: 28,
    weight: 142,
    images: [IMAGES.microDrones[0], IMAGES.microDrones[1]],
    tags: ["cinewhoop", "indoor", "prop-guards", "hd-video", "safe"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "mini-micro-drones",
    specifications: {
      "Prop Size": "2.5 inch ducted",
      Motor: "1404 4600KV",
      "FC Stack": "AIO F722 35A",
      "Camera Mount": "Vibration dampened TPU mount for Naked GoPro / Action 4",
      "Flight Time": "6-8 minutes",
    },
  },

  // ── 5. Autonomous Commercial UAVs ───────────────────────────────────────────
  {
    name: "AeroSurvey RTK Quadrotor LiDAR Mapping UAV",
    slug: "aerosurvey-rtk-lidar-mapping-uav",
    description:
      "Industrial enterprise drone built for topographical surveying, infrastructure inspection, and precision agriculture. Integrates dual-frequency RTK GNSS for centimeter-level accuracy without ground control points.",
    sku: "AFL-ASV-RTK-IND",
    price: 185000,
    quantity: 6,
    weight: 3400,
    images: [IMAGES.commercialUAV[0], IMAGES.commercialUAV[1]],
    tags: ["commercial", "rtk", "surveying", "lidar", "enterprise", "mapping"],
    isFeature: true,
    isBestseller: false,
    categorySlug: "commercial-uavs",
    specifications: {
      "Payload Capacity": "1.5 kg",
      "Max Flight Time": "52 minutes",
      "Positioning Accuracy": "RTK Fix: 1cm + 1ppm horizontal",
      "Ingress Protection": "IP55 Weather Resistance",
      "Operating Temp": "-20°C to 50°C",
    },
  },

  // ── 6. Brushless Motors & ESCs ──────────────────────────────────────────────
  {
    name: "AeroForge ApexDrive 2207.5 1950KV Brushless Motor",
    slug: "aeroforge-apexdrive-22075-1950kv",
    description:
      "Premium titanium-shaft brushless motor designed for maximum low-end torque and thermal efficiency. Features N52SH curved arc magnets, Japanese NSK 9x4x4 bearings, and 200°C oxygen-free copper windings.",
    sku: "AFL-MOT-2207-1950",
    price: 1899,
    quantity: 150,
    weight: 32.5,
    images: [IMAGES.motors[0], IMAGES.motors[1]],
    tags: ["motor", "brushless", "2207", "6s", "titanium-shaft", "nsk"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "motors-escs",
    specifications: {
      "Stator Diameter": "22 mm",
      "Stator Height": "7.5 mm",
      KV: 1950,
      "Shaft Material": "Grade 5 Titanium Alloy",
      "Peak Current": "48.5A (60s)",
      "Max Thrust": "1980g per motor (with 5.1x4.6x3 prop)",
    },
    variants: [
      { name: "1950KV (Optimized for 6S LiPo)", sku: "AFL-MOT-2207-1950KV", price: 1899, quantity: 100 },
      { name: "2550KV (Optimized for 4S LiPo)", sku: "AFL-MOT-2207-2550KV", price: 2199, quantity: 45 },
    ],
  },
  {
    name: "SpeedForce 60A 4-in-1 BlHeli_32 128K ESC",
    slug: "speedforce-60a-4in1-blheli32-esc",
    description:
      "Heavy-duty 4-in-1 ESC with genuine Toshiba MOSFETs, individual heatsink cooling plates, onboard current sensor, and bidirectional DShot1200 support up to 128kHz PWM frequency for ultra-smooth RPM filtering.",
    sku: "AFL-ESC-60A-4IN1",
    price: 6499,
    quantity: 65,
    weight: 15.2,
    images: [IMAGES.motors[1], IMAGES.motors[0]],
    tags: ["esc", "4in1", "60a", "blheli32", "dshot1200", "current-sensor"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "motors-escs",
    specifications: {
      "Continuous Current": "60A x 4",
      "Burst Current": "70A (10s)",
      "Input Voltage": "3S - 6S LiPo",
      Firmware: "BLHeli_32 Target",
      "Mounting Pattern": "30.5 x 30.5mm M3",
    },
  },

  // ── 7. Flight Controllers & Avionics ────────────────────────────────────────
  {
    name: "Nexus F722 Dual-Gyro Flight Controller Pro",
    slug: "nexus-f722-dual-gyro-fc-pro",
    description:
      "STM32F722RET6 powered flight controller equipped with dual ICM-42688-P gyros running on decoupled isolation damping. Features 8 dedicated motor outputs, integrated DJI HD plug-and-play port, 16MB blackbox flash, and dual 5V/10V BECs.",
    sku: "AFL-FC-F722-DUAL",
    price: 4999,
    quantity: 80,
    weight: 8.8,
    images: [IMAGES.flightControllers[0], IMAGES.flightControllers[1]],
    tags: ["flight-controller", "f722", "dual-gyro", "betaflight", "dji-plug"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "flight-controllers",
    specifications: {
      MCU: "STM32F722 216MHz",
      Gyro: "Dual ICM-42688-P (Software Selectable)",
      Barometer: "BMP280",
      OSD: "AT7456E + HD OSD via MSP",
      BEC: "5V 2.5A + 10V 2A (Switchable)",
      UARTs: "6 Hardware UARTS",
      Blackbox: "16MB SPI Flash",
    },
  },
  {
    name: "AeroStack F722 FC + 55A ESC Complete Flight Stack",
    slug: "aerostack-f722-55a-complete-stack",
    description:
      "A matched stack including the Nexus F722 FC and a high-performance 55A 4-in-1 ESC with plug-and-play wiring harness and CNC anodized aluminum thermal heat shield.",
    sku: "AFL-STK-F722-55A",
    price: 9999,
    quantity: 45,
    weight: 24,
    images: [IMAGES.flightControllers[1], IMAGES.flightControllers[2]],
    tags: ["stack", "f722", "55a", "plug-and-play", "combo"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "flight-controllers",
    specifications: {
      Includes: "Nexus F722 FC + 55A BlHeli_S 4-in-1 ESC",
      "Mounting Pattern": "30.5 x 30.5mm M3 Grommets",
      "Capacitor Included": "35V 1000uF Low-ESR Rubycon",
    },
  },

  // ── 8. Carbon Frames & Propellers ───────────────────────────────────────────
  {
    name: "Titan-X 5-inch Chamfered Carbon Fiber Frame Kit",
    slug: "titan-x-5inch-carbon-frame-kit",
    description:
      "Engineered with 6mm quick-swap arms, CNC 7075 aluminum camera side plates, and high-tensile 12.9 grade steel hardware. Features both 20x20mm and 30.5x30.5mm mounting slots with integrated TPU antenna and XT60 mounts.",
    sku: "AFL-FRM-TTN5-CF",
    price: 3499,
    quantity: 90,
    weight: 128,
    images: [IMAGES.frames[0], IMAGES.frames[1]],
    tags: ["frame", "carbon-fiber", "5-inch", "7075-aluminum", "quick-swap"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "propellers-frames",
    specifications: {
      "Wheelbase Diagonal": "225 mm",
      "Arm Thickness": "6.0 mm",
      "Top Plate": "2.5 mm",
      "Bottom Plate": "3.0 mm",
      "Standoff Height": "25 mm CNC Textured",
    },
  },
  {
    name: "HQProp Ethix S5 5.1x4.0x3 Tri-Blade Propellers (Set of 4)",
    slug: "hqprop-ethix-s5-tri-blade-props",
    description:
      "Ultra-durable polycarbonate tri-blade propellers tuned for silky smooth freestyle video, explosive acceleration, and high crash resilience.",
    sku: "AFL-PRP-ETH-S5",
    price: 349,
    quantity: 400,
    weight: 3.8,
    images: [IMAGES.frames[1], IMAGES.frames[0]],
    tags: ["propeller", "hqprop", "5-inch", "polycarbonate", "freestyle"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "propellers-frames",
    specifications: {
      Diameter: "5.1 inch",
      Pitch: "4.0 inch",
      Blades: 3,
      Material: "High-Impact Polycarbonate",
      Hub: "5mm Center Hole",
    },
  },

  // ── 9. LiPo Batteries & Fast Chargers ───────────────────────────────────────
  {
    name: "GraphenePower 6S 1400mAh 150C High-Discharge LiPo",
    slug: "graphenepower-6s-1400mah-150c-lipo",
    description:
      "Next-generation graphene matrix technology offering minimal voltage sag under full throttle punches, high continuous 150C discharge capability, and prolonged cycle lifespan. Terminated with genuine Amass XT60 connector.",
    sku: "AFL-BAT-6S-1400-150C",
    price: 3199,
    quantity: 120,
    weight: 220,
    images: [IMAGES.batteries[0], IMAGES.batteries[1]],
    tags: ["battery", "lipo", "6s", "1400mah", "150c", "graphene", "xt60"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "batteries-chargers",
    specifications: {
      Chemistry: "LiPo / Graphene Enhanced",
      Configuration: "6S1P (22.2V nominal)",
      Capacity: "1400 mAh",
      "C-Rating Continuous": "150C (210A)",
      "C-Rating Burst": "300C (420A)",
      "Discharge Lead": "12AWG Silicone wire with XT60",
      Dimensions: "78 x 38 x 39 mm",
    },
    variants: [
      { name: "6S 1400mAh 150C (Standard)", sku: "AFL-BAT-6S-1400-150C", price: 3199, quantity: 80 },
      { name: "6S 1550mAh 150C (Extended Capacity)", sku: "AFL-BAT-6S-1550-150C", price: 3699, quantity: 40 },
    ],
  },
  {
    name: "SkyVolt D200 Dual-Channel Smart AC/DC Balance Charger",
    slug: "skyvolt-d200-dual-channel-charger",
    description:
      "Dual independent output charger delivering up to 200W on AC or 600W on DC power. Features color IPS display, Bluetooth mobile app monitoring, internal resistance analyzer, and support for LiPo, LiHV, LiFe, and NiMH chemistries.",
    sku: "AFL-CHG-D200-DUAL",
    price: 8499,
    quantity: 40,
    weight: 580,
    images: [IMAGES.batteries[1], IMAGES.batteries[0]],
    tags: ["charger", "balance-charger", "dual-channel", "bluetooth", "ac-dc"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "batteries-chargers",
    specifications: {
      "Input Voltage": "AC 100-240V / DC 10-30V",
      "Charge Power": "AC 200W / DC 600W Total",
      "Charge Current": "0.1 - 15.0A per channel",
      "Supported Cells": "1S - 6S LiPo/LiHV",
      Screen: "2.4-inch Color IPS LCD",
    },
  },

  // ── 10. FPV Cameras & Video Systems ─────────────────────────────────────────
  {
    name: "DJI O3 Air Unit HD Digital Transmission System",
    slug: "dji-o3-air-unit-hd-digital",
    description:
      "The gold standard in FPV image transmission. Delivers 4K 60fps onboard video recording with RockSteady electronic image stabilization, 10km transmission range, and 28ms ultra-low latency canvas mode OSD integration.",
    sku: "AFL-CAM-DJI-O3",
    price: 21999,
    quantity: 50,
    weight: 36.4,
    images: [IMAGES.cameras[0], IMAGES.cameras[1]],
    tags: ["dji", "o3", "air-unit", "4k60", "hd-digital", "rocksteady"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "fpv-cameras-goggles",
    specifications: {
      "Camera Sensor": "1/1.7-inch CMOS 48MP",
      "Video Recording": "4K @ 60fps / 2.7K @ 120fps (H.265)",
      "Live Video Latency": "Down to 28 ms (1080p 100fps)",
      "Transmission Power": "Up to 33 dBm (FCC)",
      "Internal Storage": "20 GB High-Speed Flash",
    },
  },
  {
    name: "SkyZone SKY04X PRO OLED 1080p FPV Goggles",
    slug: "skyzone-sky04x-pro-oled-goggles",
    description:
      "Flagship analog & digital FPV goggles with 1920x1080 high-contrast OLED displays, 52° field of view, 60fps DVR, built-in SteadyView 5.8GHz diversity receiver, and HDMI input.",
    sku: "AFL-GOG-SKY04X-PRO",
    price: 49999,
    quantity: 18,
    weight: 265,
    images: [IMAGES.cameras[1], IMAGES.cameras[0]],
    tags: ["goggles", "skyzone", "oled", "1080p", "steadyview", "hdmi"],
    isFeature: true,
    isBestseller: false,
    categorySlug: "fpv-cameras-goggles",
    specifications: {
      Screens: "Dual 1920x1080 OLED",
      FOV: "52° Diagonal",
      "Interpupillary Distance (IPD)": "58 - 71 mm Adjustable",
      Focus: "-6 to +6 Diopter Adjustable",
      Receiver: "SteadyView V3.3 48-Channel 5.8GHz",
    },
  },

  // ── 11. Radio Transmitters & Receivers ───────────────────────────────────────
  {
    name: "RadioMaster TX16S Mark II Max Radio Transmitter",
    slug: "radiomaster-tx16s-mk2-max-radio",
    description:
      "The undisputed benchmark radio transmitter featuring Hall Effect V4.0 gimbals, full CNC aluminum faceplate, internal ExpressLRS 2.4GHz module, EdgeTX touch color interface, and rear USB-C charging.",
    sku: "AFL-TX-RM-TX16S-MAX",
    price: 26999,
    quantity: 35,
    weight: 820,
    images: [IMAGES.transmitters[0], IMAGES.transmitters[1]],
    tags: ["radiomaster", "tx16s", "elrs", "edgetx", "hall-gimbals", "transmitter"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "transmitters-receivers",
    specifications: {
      Channels: 16,
      Gimbals: "Hall Sensor V4.0 with Quad Bearings",
      Display: "4.3-inch 480x272 Color Touchscreen",
      "Internal RF": "ExpressLRS 2.4GHz (Up to 1000mW output)",
      OS: "EdgeTX Touch Enabled",
      Battery: "2x 18650 or 2S LiPo Tray",
    },
  },
  {
    name: "BetaFPV SuperD ELRS 2.4GHz Diversity Receiver",
    slug: "betafpv-superd-elrs-diversity-rx",
    description:
      "True dual-channel diversity receiver with TCXO (temperature-compensated crystal oscillator) for rock-solid link reliability in harsh RF environments up to 1000Hz packet rate.",
    sku: "AFL-RX-BFPV-SUPERD",
    price: 1899,
    quantity: 110,
    weight: 2.2,
    images: [IMAGES.transmitters[1], IMAGES.transmitters[0]],
    tags: ["receiver", "elrs", "diversity", "tcxo", "2.4ghz", "long-range"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "transmitters-receivers",
    specifications: {
      Protocol: "ExpressLRS 2.4GHz",
      Telemetry: "Yes (100mW telemetry power)",
      Antenna: "Dual Omnidirectional Dipole",
      Weight: "2.2g",
    },
  },

  // ── 12. 3D Filaments & Resins ───────────────────────────────────────────────
  {
    name: "AeroCarbon PETG-CF High-Strength Carbon Fiber Filament 1kg",
    slug: "aerocarbon-petg-cf-filament-1kg",
    description:
      "Engineering filament reinforced with 20% high-modulus chopped carbon fiber. Provides superior structural rigidity, dimensional accuracy, matte surface finish, and exceptional layer adhesion for drone canopies and camera mounts.",
    sku: "AFL-FIL-PETGCF-1KG",
    price: 2799,
    quantity: 180,
    weight: 1000,
    images: [IMAGES.filaments[0], IMAGES.filaments[1]],
    tags: ["3d-printing", "filament", "carbon-fiber", "petg-cf", "engineering"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "3d-printing-filaments",
    specifications: {
      Diameter: "1.75 mm ± 0.02 mm",
      "Nozzle Temp": "240°C - 260°C (Hardened Steel Recommended)",
      "Bed Temp": "75°C - 90°C",
      "Density": "1.29 g/cm³",
      "Tensile Strength": "65 MPa",
    },
    variants: [
      { name: "Matte Stealth Black (1kg)", sku: "AFL-FIL-PETGCF-BLK", price: 2799, quantity: 120 },
      { name: "Heavy-Duty Bulk Spool (3kg)", sku: "AFL-FIL-PETGCF-3KG", price: 6999, quantity: 35 },
    ],
  },
  {
    name: "FlexiGuard TPU 95A High-Resilience Filament 1kg",
    slug: "flexiguard-tpu-95a-filament-1kg",
    description:
      "Tough, vibration-dampening thermoplastic polyurethane designed specifically for FPV action cam bumpers, antenna mounts, and arm skids. Shore hardness 95A allows easy printing on direct-drive extruders.",
    sku: "AFL-FIL-TPU95A-1KG",
    price: 2299,
    quantity: 140,
    weight: 1000,
    images: [IMAGES.filaments[1], IMAGES.filaments[0]],
    tags: ["tpu", "flexible", "95a", "vibration-dampening", "drone-mounts"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "3d-printing-filaments",
    specifications: {
      Hardness: "Shore 95A",
      "Elongation at Break": "450%",
      "Nozzle Temp": "215°C - 235°C",
      "Bed Temp": "30°C - 60°C",
    },
    variants: [
      { name: "Stealth Black (1kg Spool)", sku: "AFL-FIL-TPU95A-BLK", price: 2299, quantity: 90 },
      { name: "Signal Neon Yellow (1kg Spool)", sku: "AFL-FIL-TPU95A-YLW", price: 2499, quantity: 50 },
    ],
  },

  // ── 13. Diagnostics & Workshop Tools ─────────────────────────────────────────
  {
    name: "AeroPulse RF Power Meter & Spectrum Analyzer (0.1 - 6 GHz)",
    slug: "aeropulse-rf-power-meter-analyzer",
    description:
      "Handheld RF power meter and 5.8GHz channel scanner designed to measure true VTX output power, antenna VSWR efficiency, and RF interference before takeoff.",
    sku: "AFL-TOOL-RF-METER",
    price: 5499,
    quantity: 45,
    weight: 180,
    images: [IMAGES.tools[0], IMAGES.tools[1]],
    tags: ["tools", "rf-meter", "vtx-tester", "spectrum-analyzer", "diagnostics"],
    isFeature: true,
    isBestseller: false,
    categorySlug: "tools-and-diagnostics",
    specifications: {
      "Frequency Range": "100 MHz - 6.0 GHz",
      "Power Range": "-45 dBm to +30 dBm (1W)",
      Connectors: "SMA Female 50 Ohm",
      Battery: "Internal 1200mAh Li-Po (USB-C Rechargeable)",
    },
  },
  {
    name: "TS101 Smart Digital Soldering Iron 65W Kit",
    slug: "ts101-smart-digital-soldering-iron-kit",
    description:
      "Portable DC/PD powered smart soldering iron with OLED display, PID temperature control from 50°C to 400°C, and turbo boost mode. Includes B2 and BC2 precision tips for delicate micro-soldering.",
    sku: "AFL-TOOL-TS101-KIT",
    price: 4299,
    quantity: 75,
    weight: 160,
    images: [IMAGES.tools[1], IMAGES.tools[0]],
    tags: ["soldering-iron", "ts101", "pd65w", "portable", "electronics-repair"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "tools-and-diagnostics",
    specifications: {
      "Max Power": "DC 65W / USB-PD 45W",
      "Temp Stability": "± 2°C",
      "Heating Time": "9 seconds from room temp to 300°C",
      Interface: "USB-C with PD 3.0 / QC Support",
    },
  },
];

// ─── Seed Helper Functions ───────────────────────────────────────────────────

async function seedAdmin() {
  console.log("👤 Seeding Administrator account...");
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@aeroforge.dev";
  const hashedPassword = await bcrypt.hash(
    process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
    10,
  );

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      name: "AeroForge Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: "AeroForge Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Administrator ready: ${adminEmail}`);
}

async function seedDemoUsers() {
  console.log("👥 Seeding Demo Users & Addresses...");

  const demoUsers = [
    {
      clerkUserId: "user_demo_pilot_01",
      name: "Alex Mercer",
      email: "alex.mercer@example.com",
      imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
      phone: "+91 98765 43210",
      address: {
        firstName: "Alex",
        lastName: "Mercer",
        address1: "742 Aeroway Boulevard, Tech Park",
        city: "Bengaluru",
        state: "Karnataka",
        zipCode: "560100",
        country: "India",
        phone: "+91 98765 43210",
        isDefault: true,
      },
    },
    {
      clerkUserId: "user_demo_engineer_02",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      phone: "+91 98123 45678",
      address: {
        firstName: "Sarah",
        lastName: "Chen",
        address1: "Flat 402, Cyber Heights, Gachibowli",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500032",
        country: "India",
        phone: "+91 98123 45678",
        isDefault: true,
      },
    },
    {
      clerkUserId: "user_demo_surveyor_03",
      name: "Marcus Vance",
      email: "marcus.vance@example.com",
      imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80",
      phone: "+91 97654 32109",
      address: {
        firstName: "Marcus",
        lastName: "Vance",
        address1: "Plot 18, MIDC Industrial Area",
        city: "Pune",
        state: "Maharashtra",
        zipCode: "411019",
        country: "India",
        phone: "+91 97654 32109",
        isDefault: true,
      },
    },
    {
      clerkUserId: "user_demo_pilot_04",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      phone: "+91 98220 11223",
      address: {
        firstName: "Priya",
        lastName: "Sharma",
        address1: "Tower B, Aero Vista Residency",
        city: "New Delhi",
        state: "Delhi",
        zipCode: "110037",
        country: "India",
        phone: "+91 98220 11223",
        isDefault: true,
      },
    },
    {
      clerkUserId: "user_demo_pilot_05",
      name: "Rohan Kulkarni",
      email: "rohan.kulkarni@example.com",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      phone: "+91 98334 55667",
      address: {
        firstName: "Rohan",
        lastName: "Kulkarni",
        address1: "Lane 4, Koregaon Park",
        city: "Pune",
        state: "Maharashtra",
        zipCode: "411001",
        country: "India",
        phone: "+91 98334 55667",
        isDefault: true,
      },
    },
    {
      clerkUserId: "user_demo_pilot_06",
      name: "Ananya Iyer",
      email: "ananya.iyer@example.com",
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      phone: "+91 98441 77889",
      address: {
        firstName: "Ananya",
        lastName: "Iyer",
        address1: "12th Cross, Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        zipCode: "560038",
        country: "India",
        phone: "+91 98441 77889",
        isDefault: true,
      },
    },
  ];

  const createdUsers = [];

  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        clerkUserId: u.clerkUserId,
        imageUrl: u.imageUrl,
        phone: u.phone,
      },
      create: {
        email: u.email,
        name: u.name,
        clerkUserId: u.clerkUserId,
        imageUrl: u.imageUrl,
        phone: u.phone,
      },
    });

    const existingAddr = await prisma.address.findFirst({
      where: { userId: user.id },
    });

    if (!existingAddr) {
      await prisma.address.create({
        data: {
          ...u.address,
          userId: user.id,
        },
      });
    }

    createdUsers.push(user);
  }

  console.log(`✅ ${createdUsers.length} Demo users ready with address books.`);
  return createdUsers;
}

async function seedCategories() {
  console.log("📂 Seeding Categories...");

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  console.log(`✅ ${categoriesData.length} categories seeded.`);
}

async function seedProducts() {
  console.log("📦 Seeding Products and Variants in bulk...");

  const categories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.slug, c.id]),
  );

  let created = 0;
  let updated = 0;

  for (const prod of productsData) {
    const categoryId = categoryMap[prod.categorySlug];
    if (!categoryId) {
      console.warn(`⚠️ Skipping ${prod.name} (category '${prod.categorySlug}' not found)`);
      continue;
    }

    const { variants, categorySlug, specifications, ...productData } = prod;

    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...productData,
          categoryId,
          specifications: specifications ?? undefined,
        },
      });
      updated++;
    } else {
      await prisma.product.create({
        data: {
          ...productData,
          categoryId,
          specifications: specifications ?? undefined,
          variants: variants
            ? {
                create: variants.map((v) => ({
                  name: v.name,
                  sku: v.sku,
                  price: v.price ?? null,
                  quantity: v.quantity,
                  image: v.image ?? null,
                })),
              }
            : undefined,
        },
      });
      created++;
    }
  }

  console.log(`✅ Products ready: ${created} created, ${updated} updated.`);
}

async function seedReviews(users: { id: string; name: string }[]) {
  console.log("⭐ Seeding Product Reviews in bulk across catalog...");

  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
  });

  const reviewTemplates = [
    {
      rating: 5,
      title: "Incredible build quality and flight response!",
      comment:
        "The throttle response is butter smooth and the carbon weave is flawless. Easily the best quad I've flown this season with zero propwash oscillation.",
    },
    {
      rating: 5,
      title: "Rock-solid telemetry and impressive ELRS range.",
      comment:
        "Paired this with my ELRS 2.4GHz setup and had 0 packet loss even behind thick tree canopy. Video feed on DJI O3 was crystal clear.",
    },
    {
      rating: 5,
      title: "Super clean soldering and factory PID tune.",
      comment:
        "Arrived pre-flashed with Betaflight 4.5. The default PID profile flew like it was on rails right out of the box!",
    },
    {
      rating: 4,
      title: "Great value for money and solid durability.",
      comment:
        "Survived three heavy tumble crashes on asphalt with only a bent propeller. Chamfered carbon edges really protect the motor wires well.",
    },
    {
      rating: 5,
      title: "Smooth brushless bearings & high efficiency.",
      comment:
        "Running these on a 6S 1300mAh pack gives me an extra 45 seconds of aggressive freestyle time compared to my previous motor set.",
    },
    {
      rating: 4,
      title: "Very reliable avionics, fast shipping to Bangalore.",
      comment:
        "Express delivery arrived in 2 days. Solder pads are large, well-spaced, and pre-tinned cleanly. Highly recommended.",
    },
    {
      rating: 3,
      title: "Decent performance, needed slight PID adjustments for wind.",
      comment:
        "Flies great on calm days, but required bumping D-term slightly in 25km/h gusty coastal winds. Overall quite satisfied.",
    },
    {
      rating: 5,
      title: "Essential addition to my field repair kit.",
      comment:
        "High quality precision CNC machining. Tolerances on the hex drivers fit snug without stripping aluminum titanium hardware.",
    },
  ];

  let reviewCount = 0;

  for (let pIdx = 0; pIdx < products.length; pIdx++) {
    const prod = products[pIdx];
    // Seed 2 to 4 reviews per product from different users
    const numReviewsForProduct = 2 + (pIdx % 3);

    for (let uIdx = 0; uIdx < numReviewsForProduct; uIdx++) {
      const user = users[(pIdx + uIdx) % users.length];
      const template = reviewTemplates[(pIdx * 2 + uIdx) % reviewTemplates.length];

      const existingReview = await prisma.review.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId: prod.id,
          },
        },
      });

      if (!existingReview) {
        await prisma.review.create({
          data: {
            userId: user.id,
            productId: prod.id,
            rating: template.rating,
            title: template.title,
            comment: template.comment,
            isVerified: true,
            isApproved: true,
          },
        });
        reviewCount++;
      }
    }
  }

  console.log(`✅ ${reviewCount} product reviews seeded across ${products.length} products.`);
}

async function seedServiceOrders(users: { id: string }[]) {
  console.log("🛠️  Seeding 3D Print and Repair Service Orders...");

  if (users.length === 0) return;
  const user = users[0];

  // 1. Seed 3D Print Order
  const printNumber = "PRN-2026-0801";
  const existingPrint = await prisma.printOrder.findUnique({
    where: { printNumber },
  });

  if (!existingPrint) {
    await prisma.printOrder.create({
      data: {
        printNumber,
        userId: user.id,
        status: PrintStatus.PRINTING,
        projectName: "GoPro 12 Hero Mount 25-Degree",
        fileUrls: ["https://aeroforge-labs.vercel.app/demo/gopro12_mount.stl"],
        images: [IMAGES.filaments[0]],
        quantity: 1,
        material: PrintMaterial.TPU,
        color: "Stealth Black",
        infill: 40,
        layerHeight: 0.2,
        printQuality: "high",
        estimatedWeight: 45.0,
        estimatedTime: 210,
        materialCost: 450,
        laborCost: 800,
        totalCost: 1250,
        paidAmount: 1250,
        customerNotes:
          "Please print with 100% infill around the base screw holes for high crash resilience.",
        adminNotes:
          "Printing on Bambu X1-Carbon with high-temp TPU profile. 3.5 hrs remaining.",
      },
    });
  }

  // 2. Seed Repair Order
  const repairNumber = "REP-2026-0902";
  const existingRepair = await prisma.repairOrder.findUnique({
    where: { repairNumber },
  });

  if (!existingRepair) {
    await prisma.repairOrder.create({
      data: {
        repairNumber,
        userId: user.id,
        status: RepairStatus.IN_PROGRESS,
        deviceType: "FPV Racing Drone",
        deviceBrand: "AeroForge",
        deviceModel: "X-500 Carbon Pro",
        issueDescription: "Crashed into concrete pillar. Arm 3 snapped and Motor #3 is desoldered and missing bell.",
        images: [IMAGES.racingDrones[0], IMAGES.motors[0]],
        diagnosisNotes: "Verified carbon delamination on rear right arm. FC and ESC tested 100% healthy on current limiter.",
        repairNotes: "Replaced 6mm carbon arm, installed new 2207 1950KV motor, calibrated gyro and test hovered.",
        estimatedCost: 3800,
        finalCost: 3800,
        paidAmount: 3800,
        laborHours: 1.5,
        laborRate: 1000,
      },
    });
  }

  // 3. Seed Sample E-Commerce Order
  const orderNumber = "ORD-2026-1003";
  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!existingOrder) {
    const firstProduct = await prisma.product.findFirst({
      where: { slug: "aeroforge-x500-carbon-pro-5inch" },
    });

    const userAddress = await prisma.address.findFirst({
      where: { userId: user.id },
    });

    if (firstProduct) {
      await prisma.order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          subtotal: firstProduct.price,
          taxAmount: Math.round(firstProduct.price * 0.18),
          shippingAmount: 0,
          totalAmount: Math.round(firstProduct.price * 1.18),
          currency: "INR",
          addressId: userAddress?.id,
          paymentMethod: "Razorpay (UPI / Card)",
          paymentIntentId: "pay_demo_rzp_order_9812739",
          items: {
            create: [
              {
                productId: firstProduct.id,
                quantity: 1,
                price: firstProduct.price,
                name: firstProduct.name,
                image: firstProduct.images[0],
              },
            ],
          },
        },
      });
    }
  }

  console.log("✅ Sample Print, Repair, and E-commerce Orders seeded.");
}

// ─── Clean Legacy Data ────────────────────────────────────────────────────────

async function cleanDatabase() {
  console.log("🧹 Purging legacy data for a clean fresh slate...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.repairOrder.deleteMany();
  await prisma.printOrder.deleteMany();
  console.log("✅ Database cleared of old legacy items.\n");
}

// ─── Main Execution ──────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Starting AeroForge Labs dynamic bulk database seed...\n");

  await cleanDatabase();
  await seedAdmin();
  const users = await seedDemoUsers();
  await seedCategories();
  await seedProducts();
  await seedReviews(users);
  await seedServiceOrders(users);

  console.log("\n✨ Database successfully populated with rich, dynamic catalog & mock data!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

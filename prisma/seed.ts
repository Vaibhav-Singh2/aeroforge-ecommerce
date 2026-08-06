import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Category Data ────────────────────────────────────────────────────────────

const categoriesData = [
  // Ready-Made Projects
  {
    name: "Racing Drones",
    slug: "racing-drones",
    description:
      "High-performance FPV racing drones built for speed and agility. Perfect for competitive flying and freestyle tricks.",
    imageUrl:
      "https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "READY_MADE_PROJECT" as const,
    isActive: true,
  },
  {
    name: "Photography Drones",
    slug: "photography-drones",
    description:
      "Professional aerial photography and videography drones with stabilized gimbals and high-resolution cameras.",
    imageUrl:
      "https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "READY_MADE_PROJECT" as const,
    isActive: true,
  },
  {
    name: "RC Planes",
    slug: "rc-planes",
    description:
      "Fixed-wing RC aircraft ranging from beginner trainers to advanced aerobatic models.",
    imageUrl:
      "https://images.pexels.com/photos/76957/tree-top-view-vista-snow-76957.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "READY_MADE_PROJECT" as const,
    isActive: true,
  },
  {
    name: "Mini & Micro Drones",
    slug: "mini-micro-drones",
    description:
      "Compact and portable drones ideal for indoor flying, beginners, and hobbyists on the go.",
    imageUrl:
      "https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "READY_MADE_PROJECT" as const,
    isActive: true,
  },
  // Parts & Accessories
  {
    name: "Motors & ESCs",
    slug: "motors-escs",
    description:
      "High-quality brushless motors and Electronic Speed Controllers for optimal drone performance.",
    imageUrl:
      "https://images.pexels.com/photos/6077870/pexels-photo-6077870.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "PART_AND_ACCESSORY" as const,
    isActive: true,
  },
  {
    name: "Flight Controllers & FC Stacks",
    slug: "flight-controllers",
    description:
      "Advanced flight controllers, FC stacks, VTXs, and receiver systems for custom builds.",
    imageUrl:
      "https://images.pexels.com/photos/4062312/pexels-photo-4062312.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "PART_AND_ACCESSORY" as const,
    isActive: true,
  },
  {
    name: "Propellers & Frames",
    slug: "propellers-frames",
    description:
      "Lightweight carbon fiber frames and a wide selection of propellers for every build type.",
    imageUrl:
      "https://images.pexels.com/photos/724994/pexels-photo-724994.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "PART_AND_ACCESSORY" as const,
    isActive: true,
  },
  {
    name: "Batteries & Chargers",
    slug: "batteries-chargers",
    description:
      "LiPo batteries, balance chargers, and power accessories to keep you flying longer.",
    imageUrl:
      "https://images.pexels.com/photos/3829736/pexels-photo-3829736.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "PART_AND_ACCESSORY" as const,
    isActive: true,
  },
  {
    name: "FPV Cameras & Goggles",
    slug: "fpv-cameras-goggles",
    description:
      "FPV cameras, video transmitters, antennas, and goggles for an immersive flying experience.",
    imageUrl:
      "https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "PART_AND_ACCESSORY" as const,
    isActive: true,
  },
  {
    name: "Transmitters & Receivers",
    slug: "transmitters-receivers",
    description:
      "RC radio transmitters, receivers, and accessories from leading brands like RadioMaster and FrSky.",
    imageUrl:
      "https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "PART_AND_ACCESSORY" as const,
    isActive: true,
  },
];

// ─── Product Data ─────────────────────────────────────────────────────────────

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
  specifications?: Record<string, string | number | boolean>;
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
  // ── Racing Drones ──────────────────────────────────────────────────────────
  {
    name: "iFlight Nazgul5 V3 HD 5-inch FPV Racing Drone",
    slug: "iflight-nazgul5-v3-hd",
    description:
      "The iFlight Nazgul5 V3 HD is a premium 5-inch FPV freestyle drone that delivers stunning HD footage via the DJI O3 digital FPV system. It features the XING2 2207 1855KV motors, Succex-E F7 V2 stack, and a robust carbon fiber frame capable of 120+ mph speeds. Ideal for both freestyle pilots and competitive FPV racers.",
    sku: "IFL-NAZ5-V3-HD",
    price: 42999,
    quantity: 18,
    weight: 390,
    images: [
      "https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["fpv", "racing", "5-inch", "iflight", "o3", "hd", "freestyle"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "racing-drones",
    specifications: {
      "Frame Size": "5 inch",
      Motor: "XING2 2207 1855KV",
      "FC Stack": "Succex-E F7 V2",
      Camera: "DJI O3 Air Unit",
      "Video System": "DJI Digital HD FPV",
      "Top Speed": "120+ mph",
      "Flight Time": "5–7 min",
      "Weight (without battery)": "390g",
    },
    variants: [
      {
        name: "DJI O3 / BNF (No Remote)",
        sku: "IFL-NAZ5-V3-HD-BNF",
        price: 42999,
        quantity: 12,
      },
      {
        name: "DJI O3 / RTF with RadioMaster TX16S",
        sku: "IFL-NAZ5-V3-HD-RTF",
        price: 66999,
        quantity: 6,
      },
    ],
  },
  {
    name: "Emax Tinyhawk 3 Freestyle RTF Kit",
    slug: "emax-tinyhawk-3-freestyle-rtf",
    description:
      "The Emax Tinyhawk 3 Freestyle is the perfect entry point into FPV racing. This Ready-To-Fly kit includes the drone, EV800D goggles, and the Emax E8 transmitter. The 2.5-inch props and brushless motors provide an exhilarating yet manageable experience for newcomers and seasoned pilots alike.",
    sku: "EMAX-TH3-FR-RTF",
    price: 18499,
    quantity: 35,
    weight: 125,
    images: [
      "https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["beginner", "whoop", "fpv", "emax", "tinyhawk", "rtf", "indoor"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "racing-drones",
    specifications: {
      "Frame Size": "2.5 inch",
      Motor: "1404 6500KV",
      Camera: "Runcam Nano4",
      "Video Transmitter": "25–200mW",
      "Flight Time": "4–6 min",
      Includes: "Drone, EV800D Goggles, E8 TX",
      Weight: "125g",
    },
  },
  {
    name: "BetaFPV Pavo25 Walksnail HD Toothpick",
    slug: "betafpv-pavo25-walksnail",
    description:
      "The Pavo25 is a sleek 2.5-inch HD freestyle quad powered by the Walksnail Avatar digital video system. Ultra-lightweight at just 89g, it flies indoors and outdoors with ease. Features the F4 1S–2S AIO FC, 1404 motors, and Walksnail Avatar Mini camera for crisp 1080p footage.",
    sku: "BFPV-PAV25-WS",
    price: 22499,
    quantity: 22,
    weight: 89,
    images: [
      "https://images.pexels.com/photos/724994/pexels-photo-724994.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: [
      "fpv",
      "toothpick",
      "hd",
      "walksnail",
      "betafpv",
      "indoor",
      "2.5inch",
    ],
    isFeature: false,
    isBestseller: false,
    categorySlug: "racing-drones",
    specifications: {
      Frame: "2.5 inch Toothpick",
      FC: "F4 AIO 20A ESC",
      Motor: "1404 3500KV",
      Camera: "Walksnail Avatar Mini",
      Weight: "89g",
      Battery: "2S 450–550mAh",
    },
  },

  // ── Photography Drones ─────────────────────────────────────────────────────
  {
    name: "DJI Mini 4 Pro (DJI RC-N2)",
    slug: "dji-mini-4-pro-rc-n2",
    description:
      "The DJI Mini 4 Pro is an ultralight folding drone under 249g, packed with a 1/1.3-inch CMOS sensor, omnidirectional obstacle sensing, and 4K/60fps HDR video capability. It supports ActiveTrack 360°, allows 20km max transmission range via O4, and is the go-to choice for travel creators and professionals.",
    sku: "DJI-M4P-RCN2",
    price: 74999,
    quantity: 10,
    weight: 249,
    images: [
      "https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["dji", "mini", "photography", "4k", "travel", "foldable", "249g"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "photography-drones",
    specifications: {
      Weight: "249g",
      "Camera Sensor": "1/1.3-inch CMOS",
      "Max Video Resolution": "4K/60fps HDR",
      "Max Photo Resolution": "48MP",
      "Obstacle Sensing": "Omnidirectional",
      "Max Transmission Range": "20 km",
      "Max Flight Time": "34 min",
      "Wind Resistance": "10.7 m/s (Level 5)",
      "Transmission System": "DJI O4",
    },
    variants: [
      {
        name: "Fly More Combo (DJI RC-N2)",
        sku: "DJI-M4P-RCN2-FMC",
        price: 99999,
        quantity: 5,
      },
      {
        name: "Standard (DJI RC-N2)",
        sku: "DJI-M4P-RCN2-STD",
        price: 74999,
        quantity: 5,
      },
    ],
  },
  {
    name: "Autel Robotics EVO Lite+ Premium Bundle",
    slug: "autel-evo-lite-plus-premium",
    description:
      "The Autel EVO Lite+ features a 1-inch CMOS sensor, 6K video at 30fps, adjustable aperture (f/2.8–f/11), and SkyLink 3 transmission covering 12km. With 40 min flight time and PDAF + CDAF hybrid autofocus, it rivals premium drones at a competitive price point.",
    sku: "AUT-ELT-PLUS-PRE",
    price: 89999,
    quantity: 7,
    weight: 835,
    images: [
      "https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["autel", "6k", "photography", "1-inch", "professional", "evo"],
    isFeature: true,
    isBestseller: false,
    categorySlug: "photography-drones",
    specifications: {
      Weight: "835g",
      Sensor: "1-inch CMOS",
      Video: "6K/30fps, 4K/60fps",
      Photo: "20MP",
      Aperture: "f/2.8–f/11",
      "Max Flight Time": "40 min",
      "Transmission Range": "12 km",
      Autofocus: "PDAF + CDAF Hybrid",
    },
  },

  // ── RC Planes ─────────────────────────────────────────────────────────────
  {
    name: "E-flite Apprentice STS 1.5m RTF with SAFE",
    slug: "eflite-apprentice-sts-rtf",
    description:
      "The Apprentice STS 1.5m is the ultimate beginner RC airplane with SAFE (Sensor Assisted Flight Envelope) technology. It features Panic Recovery mode, altitude hold, AS3X stabilization, and Beginner/Intermediate/Advanced flight modes — all in a durable foam airframe. Includes everything to fly right out of the box.",
    sku: "EFL-APP-STS15-RTF",
    price: 29999,
    quantity: 14,
    weight: 1380,
    images: [
      "https://images.pexels.com/photos/76957/tree-top-view-vista-snow-76957.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["rc-plane", "beginner", "rtf", "safe", "eflite", "trainer", "as3x"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "rc-planes",
    specifications: {
      Wingspan: "1500mm",
      Length: "1118mm",
      Weight: "1380g",
      Motor: "480W brushless",
      Battery: "3S 3200mAh LiPo",
      "Flight Time": "15–20 min",
      Stabilization: "AS3X + SAFE",
      Modes: "Beginner, Intermediate, Advanced",
      Includes: "Transmitter, Battery, Charger",
    },
  },
  {
    name: "Volantex RC Ranger EX Long Range FPV Plane",
    slug: "volantex-ranger-ex-fpv",
    description:
      "The Ranger EX is built for long-range FPV flying with its efficient 2-meter wingspan and efficient brushless powertrain. Its glider-style airframe provides stability and efficiency, making it ideal for slow scenic cruising or high-altitude FPV missions. Available as PNP (no transmitter) or RTF with transmitter.",
    sku: "VOL-RNG-EX-FPV",
    price: 16499,
    quantity: 20,
    weight: 980,
    images: [
      "https://images.pexels.com/photos/724994/pexels-photo-724994.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["rc-plane", "fpv", "long-range", "glider", "volantex", "2m"],
    isFeature: false,
    isBestseller: false,
    categorySlug: "rc-planes",
    specifications: {
      Wingspan: "1980mm",
      Weight: "980g",
      Motor: "2826 1250KV",
      Battery: "3S 2200mAh",
      "Flight Time": "35–60 min",
      "Max Speed": "90 km/h",
      "FPV Ready": true,
    },
    variants: [
      {
        name: "PNP (No Transmitter/Battery)",
        sku: "VOL-RNG-EX-PNP",
        price: 12999,
        quantity: 12,
      },
      {
        name: "RTF (Includes TX & Battery)",
        sku: "VOL-RNG-EX-RTF",
        price: 16499,
        quantity: 8,
      },
    ],
  },

  // ── Mini & Micro Drones ────────────────────────────────────────────────────
  {
    name: "DJI Tello Powered by DJI Tech",
    slug: "dji-tello",
    description:
      "The Tello is a fun mini drone ideal for kids and beginners. Powered by DJI flight technology and an Intel processor, it features 720p HD video transmission, EZ Shot modes, and a safe 5-minute flight. Programmable via the Scratch visual programming language, making it great for STEM education.",
    sku: "DJI-TELLO-DRONE",
    price: 6499,
    quantity: 50,
    weight: 80,
    images: [
      "https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["dji", "tello", "beginner", "kids", "mini", "stem", "programming"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "mini-micro-drones",
    specifications: {
      Weight: "80g",
      Camera: "5MP, 720p video",
      "Flight Time": "13 min",
      "Max Range": "100m",
      Processor: "Intel processor",
      Programmable: true,
      Stabilization: "EIS",
    },
  },
  {
    name: "BetaFPV Cetus X FPV Kit",
    slug: "betafpv-cetus-x-fpv-kit",
    description:
      "The Cetus X is a beginner FPV kit that includes the dual-camera whoop drone, EV800D goggles, and LiteRadio 3 transmitter. The dual-camera design lets you switch between FPV and HD top-down footage. Three flight modes (Normal, Sport, Manual) grow with your skill level.",
    sku: "BFPV-CETUS-X-KIT",
    price: 13999,
    quantity: 28,
    weight: 34,
    images: [
      "https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: [
      "betafpv",
      "beginner",
      "whoop",
      "kit",
      "fpv",
      "goggles",
      "dual-camera",
    ],
    isFeature: true,
    isBestseller: true,
    categorySlug: "mini-micro-drones",
    specifications: {
      Frame: "75mm Whoop",
      Weight: "34g",
      Camera: "Dual Camera (FPV + HD top)",
      Modes: "Normal / Sport / Manual",
      Battery: "1S 450mAh",
      "Flight Time": "4–6 min",
      "Kit Includes":
        "Drone, EV800D Goggles, LiteRadio 3 TX, 2x Batteries, Charger",
    },
  },

  // ── Motors & ESCs ─────────────────────────────────────────────────────────
  {
    name: "T-Motor F90 1300KV 5-inch Freestyle Motor",
    slug: "tmotor-f90-1300kv",
    description:
      "The T-Motor F90 is a top-tier freestyle motor engineered for 5-inch builds. With 1300KV winding and N52 magnets, it delivers smooth power delivery and incredible efficiency. The titanium motor shaft and ceramic bearings ensure long-lasting durability even after hard crashes.",
    sku: "TMR-F90-1300KV",
    price: 2299,
    quantity: 100,
    weight: 44,
    images: [
      "https://images.pexels.com/photos/6077870/pexels-photo-6077870.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: [
      "motor",
      "t-motor",
      "f90",
      "5-inch",
      "freestyle",
      "1300kv",
      "brushless",
    ],
    isFeature: false,
    isBestseller: true,
    categorySlug: "motors-escs",
    specifications: {
      KV: 1300,
      "Stator Size": "2306.5",
      "Max Thrust": "1700g",
      Shaft: "Titanium Alloy",
      Bearing: "Ceramic",
      Weight: "44g",
      "Recommended ESC": "30–45A",
      "Cell Count": "4S–6S",
    },
    variants: [
      {
        name: "CCW (Counter-Clockwise)",
        sku: "TMR-F90-1300KV-CCW",
        quantity: 50,
      },
      { name: "CW (Clockwise)", sku: "TMR-F90-1300KV-CW", quantity: 50 },
    ],
  },
  {
    name: "Hobbywing XRotor 45A BLHeli_32 ESC",
    slug: "hobbywing-xrotor-45a-blheli32",
    description:
      "The Hobbywing XRotor 45A is a high-performance ESC running BLHeli_32 32-bit firmware with DSHOT1200 and Multishot protocol support. Features include active freewheeling, RPM filter telemetry, and auto-timing for optimal efficiency across different motor sizes.",
    sku: "HBW-XR-45A-BL32",
    price: 1849,
    quantity: 60,
    weight: 9,
    images: [
      "https://images.pexels.com/photos/4062312/pexels-photo-4062312.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["esc", "blheli32", "hobbywing", "45a", "dshot", "single"],
    isFeature: false,
    isBestseller: false,
    categorySlug: "motors-escs",
    specifications: {
      "Current Rating": "45A continuous",
      "Burst Current": "55A",
      Firmware: "BLHeli_32",
      Protocols: "DSHOT150/300/600/1200, Multishot, Oneshot",
      Weight: "9g",
      "Input Voltage": "2S–6S LiPo",
      Telemetry: "RPM, Temp",
    },
  },

  // ── Flight Controllers ─────────────────────────────────────────────────────
  {
    name: "Matek F722-SE F7 Flight Controller",
    slug: "matek-f722-se-fc",
    description:
      "The Matek F722-SE is a feature-packed F7 flight controller ideal for 3–7 inch builds. It features a built-in OSD, 6 UARTs, dual gyros (MPU6000 + ICM42688P), barometer, blackbox, and full LED/buzzer support. Compatible with Betaflight, iNav, and Ardupilot firmware.",
    sku: "MKS-F722-SE-FC",
    price: 5499,
    quantity: 40,
    weight: 26,
    images: [
      "https://images.pexels.com/photos/4062312/pexels-photo-4062312.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["flight-controller", "f7", "matek", "betaflight", "inav", "osd"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "flight-controllers",
    specifications: {
      MCU: "STM32F722RET6",
      Gyros: "MPU6000 + ICM42688P",
      OSD: "AT7456E",
      UARTs: 6,
      Blackbox: "16MB Flash",
      Barometer: "BMP280",
      Firmware: "Betaflight, iNav, Ardupilot",
      Size: "36x36mm (30.5mm mounting)",
      Weight: "26g",
    },
  },
  {
    name: "SpeedyBee F405 WING APP FC",
    slug: "speedybee-f405-wing-app",
    description:
      "The SpeedyBee F405 WING is a dedicated fixed-wing flight controller with Bluetooth configuration via the SpeedyBee app. It features 12 servo outputs, dual IMUs, a built-in compass, barometer, and full Ardupilot/iNav support. Perfect for RC planes and VTOLs.",
    sku: "SPB-F405W-APP-FC",
    price: 6299,
    quantity: 25,
    weight: 22,
    images: [
      "https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: [
      "flight-controller",
      "fixed-wing",
      "speedybee",
      "ardupilot",
      "inav",
      "vtol",
    ],
    isFeature: false,
    isBestseller: false,
    categorySlug: "flight-controllers",
    specifications: {
      MCU: "STM32F405",
      IMU: "Dual ICM-42688P",
      "Servo Outputs": 12,
      GPS: "Built-in support",
      Bluetooth: "For SpeedyBee App config",
      Firmware: "Ardupilot, iNav",
      Barometer: "SPL06",
      Compass: "QMC5883L",
    },
  },

  // ── Propellers & Frames ────────────────────────────────────────────────────
  {
    name: "HQProp S5 5x4.3x3 Tri-Blade Propeller (Set of 4)",
    slug: "hqprop-s5-543x3-set4",
    description:
      "The HQProp S5 5x4.3x3 is a high-performance freestyle propeller injected with premium polycarbonate, delivering exceptional efficiency and durability. The tri-blade design reduces vibration and increases thrust compared to bi-blade alternatives. Includes 2 CW + 2 CCW propellers.",
    sku: "HQPR-S5-543X3-S4",
    price: 549,
    quantity: 200,
    weight: 16,
    images: [
      "https://images.pexels.com/photos/724994/pexels-photo-724994.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["propeller", "hqprop", "5inch", "tri-blade", "freestyle"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "propellers-frames",
    specifications: {
      Diameter: "5 inch",
      Pitch: "4.3",
      Blades: 3,
      Material: "Polycarbonate",
      "Mounting Hole": "5mm",
      Weight: "4g per prop",
      "Set Includes": "2x CW + 2x CCW",
    },
    variants: [
      { name: "Blue", sku: "HQPR-S5-543X3-S4-BLU", quantity: 50 },
      { name: "Red", sku: "HQPR-S5-543X3-S4-RED", quantity: 50 },
      { name: "Black", sku: "HQPR-S5-543X3-S4-BLK", quantity: 50 },
      { name: "Transparent", sku: "HQPR-S5-543X3-S4-CLR", quantity: 50 },
    ],
  },
  {
    name: "ImpulseRC Apex 5-inch FPV Frame Kit",
    slug: "impulserc-apex-5inch-frame",
    description:
      "The ImpulseRC Apex is a true X geometry 5-inch frame crafted from 5mm T700 carbon fiber arms with a thick 3mm top plate. It features a low-mounted HD camera zone for DJI O3, Walksnail, or analog setups, and a solid 30.5mm FC mounting pattern with full hardware kit included.",
    sku: "IMP-APEX5-FRM-KIT",
    price: 8999,
    quantity: 30,
    weight: 165,
    images: [
      "https://images.pexels.com/photos/6077870/pexels-photo-6077870.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["frame", "impulserc", "apex", "5inch", "carbon-fiber", "fpv"],
    isFeature: false,
    isBestseller: false,
    categorySlug: "propellers-frames",
    specifications: {
      Wheelbase: "220mm",
      "Frame Style": "True-X",
      "Arm Thickness": "5mm T700 Carbon Fiber",
      "Top Plate": "3mm Carbon Fiber",
      "Motor Mount": "16x16mm + 19x19mm",
      "FC Mount": "30.5mm",
      Weight: "165g",
    },
  },

  // ── Batteries & Chargers ──────────────────────────────────────────────────
  {
    name: "CNHL 1500mAh 4S 100C LiPo Battery",
    slug: "cnhl-1500mah-4s-100c",
    description:
      "The CNHL MiniStar 1500mAh 4S 100C is a proven favourite in the FPV racing community. With a true 100C continuous discharge rating, it delivers consistent voltage sag-free power to demanding freestyle builds and 5-inch quad setups. XT60 connector included.",
    sku: "CNHL-1500-4S-100C",
    price: 2799,
    quantity: 80,
    weight: 185,
    images: [
      "https://images.pexels.com/photos/3829736/pexels-photo-3829736.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["battery", "lipo", "4s", "1500mah", "cnhl", "fpv", "xt60"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "batteries-chargers",
    specifications: {
      Capacity: "1500mAh",
      "Cell Count": "4S (14.8V)",
      "C Rating": "100C continuous / 200C burst",
      "Max Discharge Rate": "150A",
      Connector: "XT60",
      Weight: "185g",
      Dimensions: "73x36x29mm",
    },
    variants: [
      {
        name: "Single Pack",
        sku: "CNHL-1500-4S-100C-1",
        price: 2799,
        quantity: 60,
      },
      {
        name: "Pack of 4",
        sku: "CNHL-1500-4S-100C-4",
        price: 10499,
        quantity: 20,
      },
    ],
  },
  {
    name: "ISDT Q6 Pro 14A 300W LiPo Charger",
    slug: "isdt-q6-pro-charger",
    description:
      "The ISDT Q6 Pro is a compact yet powerful 300W AC/DC smart balance charger supporting LiPo, LiHV, LiIon, NiMH, NiCd, and Pb battery types. Features a color LCD screen, USB-C PD output, and up to 14A charge current. The regenerative discharge function returns power back to the mains.",
    sku: "ISDT-Q6PRO-CHG",
    price: 4299,
    quantity: 45,
    weight: 460,
    images: [
      "https://images.pexels.com/photos/3829736/pexels-photo-3829736.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: [
      "charger",
      "isdt",
      "q6pro",
      "300w",
      "lipo",
      "balance-charger",
      "smart",
    ],
    isFeature: true,
    isBestseller: true,
    categorySlug: "batteries-chargers",
    specifications: {
      "Max Charge Power": "300W",
      "Max Charge Current": "14A",
      "Input Voltage": "AC 100–240V / DC 12–30V",
      "Chemistry Support": "LiPo, LiHV, LiIon, NiMH, NiCd, Pb",
      Display: "Color LCD",
      "USB Output": "USB-C PD 45W",
      Weight: "460g",
    },
  },

  // ── FPV Cameras & Goggles ─────────────────────────────────────────────────
  {
    name: "RunCam Phoenix 2 SP FPV Camera",
    slug: "runcam-phoenix-2-sp-fpv",
    description:
      "The RunCam Phoenix 2 SP is an ultra-wide dynamic range FPV camera with a 1/2-inch Sony 2MP sensor, offering exceptional low-light performance. With 165° FOV, super WDR, and 120fps support at FHD, it provides crisp and smooth FPV footage in all lighting conditions.",
    sku: "RNC-PHX2-SP-CAM",
    price: 3299,
    quantity: 55,
    weight: 24,
    images: [
      "https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["camera", "fpv", "runcam", "phoenix", "sony", "low-light", "wdr"],
    isFeature: true,
    isBestseller: true,
    categorySlug: "fpv-cameras-goggles",
    specifications: {
      Sensor: "1/2-inch Sony IMX662",
      Megapixels: 2,
      FOV: "165°",
      "Dynamic Range": "Super WDR 120dB",
      Resolution: "1920x1080 @120fps",
      "Input Voltage": "5–36V",
      Weight: "24g",
      Format: "M12 / CS Lens Mount",
    },
  },
  {
    name: "Skyzone SKY04X V2 OLED FPV Goggles",
    slug: "skyzone-sky04x-v2-oled",
    description:
      "The Skyzone SKY04X V2 are a premium FPV headset featuring 1280×960 OLED displays with 46 PPD pixel density, a built-in DVR, fan cooling, 72° FOV, and support for multiple video formats (HDMI in, AV in). The Head Tracker module and focus-adjustable lenses make for an immersive flying experience.",
    sku: "SKY-04XV2-OLED-FPV",
    price: 36999,
    quantity: 12,
    weight: 460,
    images: [
      "https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["goggles", "fpv", "skyzone", "oled", "hd", "head-tracker", "dvr"],
    isFeature: true,
    isBestseller: false,
    categorySlug: "fpv-cameras-goggles",
    specifications: {
      Display: "OLED 1280×960 per eye",
      FOV: "72°",
      PPD: "46 PPD",
      DVR: "Built-in MicroSD",
      "Video Input": "HDMI, AV",
      "Head Tracking": "Included",
      Battery: "18650 (2x included)",
      Weight: "460g",
      "Fan Cooling": true,
    },
  },

  // ── Transmitters & Receivers ──────────────────────────────────────────────
  {
    name: "RadioMaster TX16S Mark II MAX ELRS",
    slug: "radiomaster-tx16s-mkii-max-elrs",
    description:
      "The RadioMaster TX16S Mark II MAX is the gold-standard OpenTX/EdgeTX transmitter for FPV pilots and RC plane enthusiasts. Featuring a built-in ELRS 2.4GHz module, Hall-effect gimbals, 4.3-inch color touchscreen, dual USB-C, and Bluetooth/WiFi telemetry — it's the ultimate radio controller for all skill levels.",
    sku: "RDMST-TX16SII-MAX-ELRS",
    price: 19499,
    quantity: 20,
    weight: 840,
    images: [
      "https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: [
      "transmitter",
      "radiomaster",
      "tx16s",
      "elrs",
      "edgetx",
      "hall-effect",
    ],
    isFeature: true,
    isBestseller: true,
    categorySlug: "transmitters-receivers",
    specifications: {
      Channels: 16,
      Telemetry: "Bluetooth / WiFi",
      Screen: "4.3-inch Color Touchscreen",
      Gimbals: "Hall Effect M12",
      "RF Module": "Internal ELRS 2.4GHz",
      Firmware: "EdgeTX / OpenTX",
      Battery: "2x 18650 (included)",
      Weight: "840g",
      Charging: "USB-C",
    },
  },
  {
    name: "BetaFPV ELRS Nano 2.4GHz Receiver",
    slug: "betafpv-elrs-nano-24ghz-rx",
    description:
      "The BetaFPV ELRS Nano is a featherlight 1.5g ExpressLRS 2.4GHz receiver ideal for micro quad and 5-inch builds alike. It supports ELRS firmware updates over Betaflight passthrough, features a ceramic antenna for maximum range, and connects via UART at up to 1000Hz link speed.",
    sku: "BFPV-ELRS-NANO-24-RX",
    price: 1299,
    quantity: 120,
    weight: 1.5,
    images: [
      "https://images.pexels.com/photos/4062312/pexels-photo-4062312.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    tags: ["receiver", "elrs", "betafpv", "nano", "2.4ghz", "ultra-light"],
    isFeature: false,
    isBestseller: true,
    categorySlug: "transmitters-receivers",
    specifications: {
      Protocol: "ExpressLRS (ELRS) 2.4GHz",
      Weight: "1.5g",
      Antenna: "Ceramic Patch",
      "Update Rate": "Up to 1000Hz",
      Telemetry: "Yes",
      "UART Interface": "RX/TX pads",
      Voltage: "5V",
      "Firmware Update": "Betaflight Passthrough / WiFi",
    },
  },
];

// ─── Admin Data ───────────────────────────────────────────────────────────────

async function createDefaultAdmin() {
  const adminCount = await prisma.admin.count();

  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash(
      process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
      10,
    );

    await prisma.admin.create({
      data: {
        email:
          process.env.DEFAULT_ADMIN_EMAIL || "admin@aeroforge.dev",
        password: hashedPassword,
        name: "AeroForge Admin",
        role: "ADMIN",
      },
    });
    console.log("✅ Default admin account created.");
  } else {
    console.log("ℹ️  Admin already exists, skipping.");
  }
}

// ─── Seed Functions ───────────────────────────────────────────────────────────

async function seedCategories() {
  console.log("🌱 Seeding categories...");

  // Upsert each category by slug to avoid duplicate key errors on re-runs
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
  console.log("🌱 Seeding products...");

  // Build a slug → id map for categories
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryMap = Object.fromEntries(
    categories.map((category: { slug: string; id: string }) => [
      category.slug,
      category.id,
    ]),
  ) as Record<string, string>;

  let created = 0;
  let skipped = 0;

  for (const prod of productsData) {
    const categoryId = categoryMap[prod.categorySlug];
    if (!categoryId) {
      console.warn(
        `⚠️  No category found for slug '${prod.categorySlug}', skipping product '${prod.name}'`,
      );
      skipped++;
      continue;
    }

    // Check if product already exists by slug
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const { variants, categorySlug, specifications, ...productData } = prod;

    const createdProduct = await prisma.product.create({
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

    console.log(`  ✓ Created: ${createdProduct.name}`);
    created++;
  }

  console.log(`\n✅ Products seeded: ${created} created, ${skipped} skipped.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Starting database seed...\n");

  await createDefaultAdmin();
  await seedCategories();
  await seedProducts();

  console.log("\n🎉 Seed complete!");
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

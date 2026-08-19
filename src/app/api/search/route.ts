import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  href: string;
  type: "service" | "page";
  badge: string;
}

const STATIC_SERVICES: ServiceItem[] = [
  {
    id: "srv-3d-print",
    name: "On-Demand 3D Printing Service",
    description:
      "Upload .STL/.OBJ CAD files for custom rapid manufacturing in PLA, ABS, PETG, TPU & Carbon Fiber.",
    href: "/services/3d-printing",
    type: "service",
    badge: "Manufacturing",
  },
  {
    id: "srv-repair",
    name: "Drone Diagnostics & Repair Service",
    description:
      "Expert hardware crash inspection, brushless motor desoldering, ESC smoke testing, and gyro calibration.",
    href: "/services/repair",
    type: "service",
    badge: "Repair & Diagnostic",
  },
  {
    id: "srv-orders",
    name: "My Orders & Shipment Tracking",
    description: "Track live status, invoices, and tracking numbers for your AeroForge orders.",
    href: "/account/orders",
    type: "page",
    badge: "Account",
  },
  {
    id: "srv-addresses",
    name: "Saved Shipping Addresses",
    description: "Manage default shipping and billing destinations for express checkout.",
    href: "/account/addresses",
    type: "page",
    badge: "Account",
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json({
        products: [],
        categories: [],
        services: STATIC_SERVICES,
      });
    }

    const lowerQuery = query.toLowerCase();

    // 1. Search Products & Product Variants in MongoDB via Prisma
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
          { tags: { has: lowerQuery } },
          {
            variants: {
              some: {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { sku: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          },
        ],
      },
      take: 12,
      include: {
        category: {
          select: { name: true, slug: true, type: true },
        },
        variants: true,
      },
      orderBy: { isBestseller: "desc" },
    });

    // Flatten results: If specific variants match the query, generate variant-specific entries
    const searchProductResults: any[] = [];

    for (const p of products) {
      const matchingVariants = p.variants.filter(
        (v) =>
          v.name.toLowerCase().includes(lowerQuery) ||
          (v.sku && v.sku.toLowerCase().includes(lowerQuery)),
      );

      if (matchingVariants.length > 0) {
        // Surface the specific matching variants directly!
        for (const mv of matchingVariants) {
          searchProductResults.push({
            id: `${p.id}-${mv.id}`,
            productId: p.id,
            variantId: mv.id,
            name: `${p.name} — ${mv.name}`,
            slug: p.slug,
            url: `/product/${p.slug}?variant=${mv.id}`,
            sku: mv.sku || p.sku,
            price: mv.price ?? p.price,
            image: mv.image || p.images?.[0],
            category: p.category.name,
            categorySlug: p.category.slug,
            isBestseller: p.isBestseller,
            variantName: mv.name,
          });
        }
      } else {
        // Parent product matched
        searchProductResults.push({
          id: p.id,
          productId: p.id,
          name: p.name,
          slug: p.slug,
          url: `/product/${p.slug}`,
          sku: p.sku,
          price: p.price,
          image: p.images?.[0],
          category: p.category.name,
          categorySlug: p.category.slug,
          isBestseller: p.isBestseller,
        });
      }
    }

    // 2. Search Categories in MongoDB via Prisma
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        type: true,
      },
    });

    // 3. Match Services
    const services = STATIC_SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.badge.toLowerCase().includes(lowerQuery),
    );

    return NextResponse.json({
      products: searchProductResults.slice(0, 10),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        type: c.type === "READY_MADE_PROJECT" ? "projects" : "parts-and-accessories",
        imageUrl: c.imageUrl,
      })),
      services,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to perform universal search" },
      { status: 500 },
    );
  }
}

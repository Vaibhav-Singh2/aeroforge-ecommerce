import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ComparisonMatrix } from "@/components/compare/comparison-matrix";

export const metadata: Metadata = {
  title: "Aircraft & Hardware Comparison Matrix – AeroForge Labs",
  description:
    "Compare technical aerodynamics, motor thrust, battery flight times, and avionics side-by-side on AeroForge Labs.",
};

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
    take: 25,
    orderBy: { isBestseller: "desc" },
  });

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image: p.images?.[0],
    category: p.category.name,
    sku: p.sku,
    specifications: (p.specifications as Record<string, any>) || undefined,
    description: p.description,
  }));

  return <ComparisonMatrix catalogProducts={formattedProducts} />;
}

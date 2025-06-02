import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getFeaturedProducts,
  getBestsellerProducts,
} from "@/lib/services/product-service";
import { ProductGrid } from "@/components/products/product-grid";

export async function FeaturedProducts() {
  // Use server-side data fetching
  const { products: featuredProducts } = await getFeaturedProducts(4);
  const { products: bestsellerProducts } = await getBestsellerProducts(4);

  return (
    <section className="container py-16">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="text-muted-foreground">
            Explore our collection of high-quality drones and accessories
          </p>
        </div>
        <Link href="/category/all">
          <Button variant="link" className="group gap-1">
            View all products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <ProductGrid products={featuredProducts} />

      <div className="mt-16 mb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Bestsellers</h2>
          <p className="text-muted-foreground">
            Our most popular products that customers love
          </p>
        </div>
      </div>

      <ProductGrid products={bestsellerProducts} />
    </section>
  );
}

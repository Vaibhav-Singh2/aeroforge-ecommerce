"use client";

import { Product } from "@prisma/client";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  variant?: "default" | "compact";
}

export function ProductGrid({
  products,
  variant = "default",
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
}

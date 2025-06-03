"use client";

import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import type { Product } from "@prisma/client";

// This component serves as a client-side wrapper for the category page's card footer
export function ClientAddToCartButton({
  product,
}: {
  product: Product & {
    category?: { name: string; slug: string } | null;
  };
}) {
  return (
    <AddToCartButton
      productId={product.id}
      productName={product.name}
      product={product}
    />
  );
}

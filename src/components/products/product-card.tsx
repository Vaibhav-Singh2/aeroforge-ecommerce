"use client";

import Link from "next/link";
// ...existing code...
import { Product } from "@prisma/client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
// ...existing code...
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { QuickViewDialog } from "@/components/products/quick-view-dialog";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import Image from "next/image";

interface ProductCardProps {
  product: Product & {
    category?: { name: string; slug: string } | null;
  };
  variant?: "default" | "compact";
}

export function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const isCompact = variant === "compact";

  // Ensure product.category has a slug, not id, without using 'any'
  let categoryWithSlug: { name: string; slug: string } | undefined = undefined;
  if (product.category) {
    if (
      "slug" in product.category &&
      typeof product.category.slug === "string"
    ) {
      categoryWithSlug = {
        name: product.category.name,
        slug: product.category.slug,
      };
    } else if (
      "id" in product.category &&
      typeof (product.category as { id?: string }).id === "string"
    ) {
      categoryWithSlug = {
        name: product.category.name,
        slug: (product.category as { id: string }).id,
      };
    }
  }
  const productWithSlug = { ...product, category: categoryWithSlug };

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <AspectRatio ratio={1 / 1}>
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                width={300}
                height={300}
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
                No image
              </div>
            )}
          </AspectRatio>
        </Link>

        {/* Floating Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 transition-opacity duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          <WishlistButton product={product} />
          <QuickViewDialog product={product} />
        </div>
      </div>
      <CardContent className={isCompact ? "p-2" : "p-4"}>
        <div className="space-y-1">
          {productWithSlug.category && (
            <p
              className={`text-muted-foreground ${isCompact ? "text-xs" : "text-sm"}`}
            >
              {productWithSlug.category.name}
            </p>
          )}
          <Link href={`/product/${product.slug}`} className="group">
            <h3
              className={`line-clamp-2 font-medium group-hover:underline ${isCompact ? "text-sm" : "text-base"}`}
            >
              {product.name}
            </h3>
          </Link>
        </div>
      </CardContent>
      <CardFooter
        className={
          isCompact
            ? "flex items-center justify-between gap-2 px-2 pb-2"
            : "flex flex-col items-stretch gap-3 px-4 pb-4"
        }
      >
        <div>
          <p className={`font-semibold ${isCompact ? "text-sm" : "text-base"}`}>
            ₹{product.price.toFixed(2)}
          </p>
          {product.isBestseller && (
            <Badge
              variant="secondary"
              className={isCompact ? "py-0 text-xs" : ""}
            >
              Bestseller
            </Badge>
          )}
        </div>
        <AddToCartButton
          product={productWithSlug}
          size={isCompact ? "sm" : "default"}
          className={
            "hover:bg-primary hover:text-primary-foreground transition-colors" +
            (isCompact ? "" : " w-full justify-center")
          }
        >
          {isCompact ? "Add" : undefined}
        </AddToCartButton>
      </CardFooter>
    </Card>
  );
}

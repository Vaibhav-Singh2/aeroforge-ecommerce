"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Product } from "@prisma/client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addCartItem } from "@/lib/redux/features/cartSlice";
import { addToast } from "@/lib/redux/features/uiSlice";
import { addToCart } from "@/lib/actions/cart-actions";
import Image from "next/image";

interface ProductCardProps {
  product: Product & {
    category?: { name: string; id: string } | null;
  };
  variant?: "default" | "compact";
}

export function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Add to server-side cart
      await addToCart(product.id, 1);

      // Update client-side cart state for immediate UI update
      dispatch(
        addCartItem({
          id: `temp-${Date.now()}`, // Will be replaced on next refresh
          productId: product.id,
          quantity: 1,
          product: product,
        }),
      );

      // Show success notification
      dispatch(
        addToast({
          type: "success",
          title: "Added to cart",
          message: `${product.name} has been added to your cart.`,
        }),
      );
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      dispatch(
        addToast({
          type: "error",
          title: "Error",
          message: "Failed to add item to cart. Please try again.",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isCompact = variant === "compact";

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <Link href={`/product/${product.slug}`}>
        <AspectRatio ratio={1 / 1}>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
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
      <CardContent className={isCompact ? "p-2" : "p-4"}>
        <div className="space-y-1">
          {product.category && (
            <p
              className={`text-muted-foreground ${isCompact ? "text-xs" : "text-sm"}`}
            >
              {product.category.name}
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
        className={`flex items-center justify-between gap-2 ${isCompact ? "px-2 pb-2" : "px-4 pb-4"}`}
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
        <Button
          variant="outline"
          size={isCompact ? "sm" : "default"}
          onClick={handleAddToCart}
          disabled={isLoading}
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ShoppingCart
            className={`${isCompact ? "h-3.5 w-3.5" : "h-4 w-4"} mr-2`}
          />
          {isCompact ? "Add" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

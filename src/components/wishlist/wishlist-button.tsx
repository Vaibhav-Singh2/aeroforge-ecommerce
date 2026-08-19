"use client";

import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleWishlistItem } from "@/lib/redux/features/wishlistSlice";
import { Button } from "@/components/ui/button";

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images?: string[];
    category?: { name: string } | null;
    sku?: string;
  };
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({
  product,
  variant = "icon",
  className = "",
}: WishlistButtonProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      toggleWishlistItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images?.[0],
        category: product.category?.name,
        sku: product.sku,
      }),
    );
  };

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        size="default"
        onClick={handleToggle}
        className={`gap-2 ${className} ${
          isWishlisted
            ? "border-red-500/40 text-red-500 bg-red-500/5 hover:bg-red-500/10"
            : ""
        }`}
      >
        <Heart
          className={`h-4 w-4 transition-transform active:scale-125 ${
            isWishlisted ? "fill-red-500 text-red-500" : ""
          }`}
        />
        <span>{isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}</span>
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={handleToggle}
      className={`h-8 w-8 rounded-full shadow-md backdrop-blur-md bg-background/80 hover:bg-background transition-all ${
        isWishlisted ? "text-red-500" : "text-muted-foreground hover:text-foreground"
      } ${className}`}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-4 w-4 transition-transform active:scale-125 ${
          isWishlisted ? "fill-red-500 text-red-500" : ""
        }`}
      />
      <span className="sr-only">Toggle Wishlist</span>
    </Button>
  );
}

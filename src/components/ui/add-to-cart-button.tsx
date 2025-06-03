"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addCartItem } from "@/lib/redux/features/cartSlice";
import { addToast } from "@/lib/redux/features/uiSlice";
import { addToCart } from "@/lib/actions/cart-actions";
import type { Product } from "@prisma/client";

interface ProductCardButtonProps {
  productId: string;
  productName: string;
  product: Product & {
    category?: { name: string; slug: string } | null;
  };
}

export function AddToCartButton({
  productId,
  productName,
  product,
}: ProductCardButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Add to server-side cart
      await addToCart(productId, 1);

      // Update client-side cart state for immediate UI update
      dispatch(
        addCartItem({
          id: `temp-${Date.now()}`, // Will be replaced on next refresh
          productId: productId,
          quantity: 1,
          product: product,
        }),
      );

      // Show success notification
      dispatch(
        addToast({
          type: "success",
          title: "Added to cart",
          message: `${productName} has been added to your cart.`,
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

  return (
    <Button
      size="sm"
      className="w-full gap-2"
      onClick={handleAddToCart}
      disabled={isLoading}
    >
      <ShoppingCart className="h-4 w-4" />
      Add to Cart
    </Button>
  );
}

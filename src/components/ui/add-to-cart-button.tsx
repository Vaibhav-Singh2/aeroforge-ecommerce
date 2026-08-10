"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addCartItem } from "@/lib/redux/features/cartSlice";
import { addToast } from "@/lib/redux/features/uiSlice";
import { addToCart } from "@/lib/actions/cart-actions";

import type { Product } from "@prisma/client";

interface AddToCartButtonProps {
  product: Product & {
    category?: { name: string; slug: string } | null;
  };
  quantity?: number;
  variantId?: string;
  size?: "sm" | "default";
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variantId,
  size = "sm",
  className = "w-full gap-2",
  children,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const hasCustomContent = children !== undefined && children !== null;
  const dispatch = useAppDispatch();
  const { isSignedIn } = useUser();
  const clerk = useClerk();

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      if (clerk && typeof clerk.openSignIn === "function") {
        clerk.openSignIn();
      } else if (
        typeof window !== "undefined" &&
        typeof (
          window as unknown as {
            Clerk?: {
              openSignIn?: () => void;
            };
          }
        ).Clerk?.openSignIn === "function"
      ) {
        (
          window as unknown as {
            Clerk: {
              openSignIn: () => void;
            };
          }
        ).Clerk.openSignIn();
      }
      return;
    }
    setIsLoading(true);
    try {
      // Add to server-side cart
      await addToCart(product.id, quantity, variantId);

      // Update client-side cart state for immediate UI update
      dispatch(
        addCartItem({
          id: `temp-${Date.now()}`,
          productId: product.id,
          variantId,
          quantity,
          product,
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

  return (
    <Button
      size={size}
      className={className}
      onClick={handleAddToCart}
      disabled={isLoading}
    >
      {hasCustomContent ? (
        children
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Add to cart
        </>
      )}
    </Button>
  );
}

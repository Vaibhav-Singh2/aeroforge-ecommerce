"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowRight, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  closeWishlist,
  removeFromWishlist,
  clearWishlist,
} from "@/lib/redux/features/wishlistSlice";
import { addCartItem, openCart } from "@/lib/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function WishlistDrawer() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.wishlist);

  if (!isOpen) return null;

  const handleMoveToCart = (item: any) => {
    // Add to cart
    dispatch(
      addCartItem({
        id: `cart-${item.id}-${Date.now()}`,
        productId: item.id,
        quantity: 1,
        product: {
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: item.price,
          description: "",
          sku: item.sku || "",
          images: item.image ? [item.image] : [],
          tags: [],
          isFeature: false,
          isBestseller: false,
          trackQuantity: true,
          quantity: 10,
          weight: null,
          status: "ACTIVE" as any,
          categoryId: "",
          specifications: null,
          compatibleParts: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      }),
    );
    // Remove from wishlist
    dispatch(removeFromWishlist(item.id));
    // Close wishlist and open quick cart
    dispatch(closeWishlist());
    dispatch(openCart());
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300">
      <div className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col border-l bg-background shadow-2xl transition-transform duration-300 animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-5">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-primary text-primary" />
            <h2 className="text-base font-bold text-foreground">
              Pilot Wishlist ({items.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(clearWishlist())}
                className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(closeWishlist())}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close wishlist</span>
            </Button>
          </div>
        </div>

        {/* Wishlist Items List */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
              <Heart className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Your Wishlist is Empty</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Save parts, racing quads, and avionics to build your dream setup later.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(closeWishlist())}
              asChild
            >
              <Link href="/category/projects">Browse Drone Catalog</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y px-5">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3.5 py-4 items-center">
                {/* Thumbnail */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                      No photo
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  {item.category && (
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
                      {item.category}
                    </span>
                  )}
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={() => dispatch(closeWishlist())}
                    className="text-xs font-semibold text-foreground line-clamp-1 hover:underline block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs font-bold text-foreground font-mono">
                    ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    className="h-7 gap-1 text-[11px] px-2.5"
                    onClick={() => handleMoveToCart(item)}
                  >
                    <ShoppingBag className="h-3 w-3" />
                    <span>Add to Cart</span>
                  </Button>
                  <button
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  closeCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.variant?.price ?? item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100),
  );

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300">
      <div
        className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col border-l bg-background shadow-2xl transition-transform duration-300 animate-in slide-in-from-right"
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b px-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Your Cart</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {totalItemsCount}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(closeCart())}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close cart</span>
          </Button>
        </div>

        {/* Free Shipping Progress */}
        <div className="border-b bg-muted/30 px-5 py-2.5 text-xs">
          {subtotal >= freeShippingThreshold ? (
            <p className="font-medium text-green-600 dark:text-green-400">
              🎉 Congratulations! You qualified for <strong>Free Shipping</strong>.
            </p>
          ) : (
            <p className="text-muted-foreground">
              Add <strong className="text-foreground">₹{freeShippingThreshold - subtotal}</strong> more to unlock <strong>Free Shipping</strong>!
            </p>
          )}
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Your cart is empty</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-[240px]">
              Explore our performance racing drones, RC wings, and precision avionics.
            </p>
            <Button
              className="mt-5 gap-2 text-xs"
              onClick={() => dispatch(closeCart())}
              asChild
            >
              <Link href="/category/projects">
                <span>Start Shopping</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1 px-5 py-4">
            <div className="space-y-4">
              {items.map((item) => {
                const itemPrice = item.variant?.price ?? item.product.price;
                const imageSrc =
                  item.variant?.image ||
                  (item.product.images && item.product.images[0]) ||
                  "/placeholder.svg";

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3.5 rounded-lg border bg-card p-3 shadow-2xs transition-all hover:border-primary/30"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={() => dispatch(closeCart())}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted"
                    >
                      <Image
                        src={imageSrc}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => dispatch(closeCart())}
                        className="truncate text-xs font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {item.product.name}
                      </Link>

                      {item.variant && (
                        <span className="text-[11px] text-muted-foreground">
                          Option: {item.variant.name}
                        </span>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          ₹{itemPrice.toLocaleString("en-IN")}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1.5 rounded-md border bg-background px-1 py-0.5">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                dispatch(
                                  updateCartItemQuantity({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  }),
                                );
                              } else {
                                dispatch(removeCartItem(item.id));
                              }
                            }}
                            className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-4 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateCartItemQuantity({
                                  id: item.id,
                                  quantity: item.quantity + 1,
                                }),
                              )
                            }
                            className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => dispatch(removeCartItem(item.id))}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="border-t bg-muted/20 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-base font-bold text-foreground">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Taxes and delivery calculated during checkout.</span>
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <Button
                className="w-full gap-2 text-xs font-semibold shadow-xs"
                asChild
                onClick={() => dispatch(closeCart())}
              >
                <Link href="/checkout">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full text-xs"
                asChild
                onClick={() => dispatch(closeCart())}
              >
                <Link href="/cart">View Full Cart Details</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

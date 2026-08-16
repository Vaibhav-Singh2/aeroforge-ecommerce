"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setCartItems,
  updateCartItemQuantity,
  removeCartItem,
  type CartItem,
} from "@/lib/redux/features/cartSlice";
import { addToast } from "@/lib/redux/features/uiSlice";
import {
  getUserCartItems,
  updateCartItemQuantity as updateCartItemQuantityAction,
  removeCartItem as removeCartItemAction,
} from "@/lib/actions/cart-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function CartPage() {
  const { items } = useAppSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Fetch cart items from the server on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartItems = await getUserCartItems();
        dispatch(setCartItems(cartItems));
      } catch (error) {
        console.error("Error fetching cart items:", error);
        dispatch(
          addToast({
            type: "error",
            title: "Error",
            message: "Failed to load your cart. Please try again.",
          }),
        );
      }
    };

    fetchCartItems();
  }, [dispatch]);

  // Handle quantity change
  const handleQuantityChange = async (id: string, quantity: number) => {
    setIsLoading(true);
    try {
      await updateCartItemQuantityAction(id, quantity);
      dispatch(updateCartItemQuantity({ id, quantity }));
    } catch (error) {
      console.error("Failed to update quantity:", error);
      dispatch(
        addToast({
          type: "error",
          title: "Error",
          message: "Failed to update quantity. Please try again.",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (id: string) => {
    setIsLoading(true);
    try {
      await removeCartItemAction(id);
      dispatch(removeCartItem(id));
      dispatch(
        addToast({
          type: "success",
          title: "Item removed",
          message: "Item removed from your cart.",
        }),
      );
    } catch (error) {
      console.error("Failed to remove item:", error);
      dispatch(
        addToast({
          type: "error",
          title: "Error",
          message: "Failed to remove item. Please try again.",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate cart totals
  const subtotal = items.reduce(
    (total: number, item: CartItem) =>
      total + (item.variant?.price || item.product.price) * item.quantity,
    0,
  );

  const shippingCost = subtotal > 999 ? 0 : 120; // Free shipping over ₹999
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;

  // Handle checkout
  const handleCheckout = () => {
    // If items present, redirect to checkout
    if (items.length > 0) {
      router.push("/checkout");
    } else {
      dispatch(
        addToast({
          type: "error",
          title: "Empty Cart",
          message: "Your cart is empty. Add some products before checkout.",
        }),
      );
    }
  };

  return (
    <div className="container mx-auto px-5 py-10">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-6 py-16">
          <ShoppingBag className="text-muted-foreground h-16 w-16" />
          <div className="text-center">
            <h2 className="mb-1 text-xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              {`Looks like you haven't added anything to your cart yet.`}
            </p>
            <Button asChild>
              <Link href="/category/projects">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Cart Items */}
            <div className="space-y-6">
              {items.map((item: CartItem) => {
                const price = item.variant?.price ?? item.product.price;
                const itemTotal = price * item.quantity;

                return (
                  <div key={item.id} className="flex space-x-4 py-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="bg-muted flex h-full w-full items-center justify-center">
                          <span className="text-muted-foreground text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">
                            <Link
                              href={`/product/${item.product.slug}`}
                              className="hover:underline"
                            >
                              {item.product.name}
                            </Link>
                          </h3>
                          {item.variant && (
                            <p className="text-muted-foreground mt-1 text-sm">
                              Variant: {item.variant.name}
                            </p>
                          )}
                        </div>
                        <p className="font-medium">₹{itemTotal.toFixed(2)}</p>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center rounded-md border">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            disabled={isLoading || item.quantity <= 1}
                            className="hover:bg-muted border-r px-3 py-1"
                          >
                            -
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={isLoading}
                            className="hover:bg-muted border-l px-3 py-1"
                          >
                            +
                          </button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back to shopping */}
            <div>
              <Button variant="outline" asChild>
                <Link
                  href="/category/projects"
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  {shippingCost > 0 ? (
                    <span>₹{shippingCost.toFixed(2)}</span>
                  ) : (
                    <span className="text-green-600">Free</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                {/* Coupon code input */}
                <div className="pt-4">
                  <div className="flex gap-2">
                    <Input placeholder="Coupon Code" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>

                <Button
                  className="mt-4 w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading || items.length === 0}
                >
                  Proceed to Checkout
                </Button>

                <p className="text-muted-foreground mt-4 text-center text-xs">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

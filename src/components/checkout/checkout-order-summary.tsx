"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/lib/redux/features/cartSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingMethod: string;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  shippingCost,
  tax,
  total,
  shippingMethod,
}: CheckoutOrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Order items */}
        <div className="space-y-4">
          {items.map((item) => {
            const price = item.variant?.price ?? item.product.price;
            const itemTotal = price * item.quantity;

            return (
              <div key={item.id} className="flex gap-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={64}
                      height={64}
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
                      <h4 className="text-sm font-medium">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="hover:underline"
                        >
                          {item.product.name}
                        </Link>
                      </h4>
                      {item.variant && (
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          Variant: {item.variant.name}
                        </p>
                      )}
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ₹{itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Price breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Shipping ({shippingMethod})
            </span>
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
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <div className="text-muted-foreground text-center text-xs">
          By placing your order, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </div>
      </CardContent>
    </Card>
  );
}

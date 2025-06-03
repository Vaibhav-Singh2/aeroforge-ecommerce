"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ChevronLeft, CreditCard, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addToast } from "@/lib/redux/features/uiSlice";
import { clearCart } from "@/lib/redux/features/cartSlice";
import { getUserCartItems } from "@/lib/actions/cart-actions";
import { createOrder } from "@/lib/actions/order-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckoutAddressForm } from "./checkout-address-form";
import { CheckoutPaymentForm } from "./checkout-payment-form";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define the checkout steps
const STEPS = {
  ADDRESS: "address",
  SHIPPING: "shipping",
  PAYMENT: "payment",
  CONFIRMATION: "confirmation",
};

// Define shipping options
const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 120,
    description: "Delivery in 3-5 business days",
    freeThreshold: 999,
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 240,
    description: "Delivery in 1-2 business days",
    freeThreshold: 1499,
  },
];

export function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { addresses } = useAppSelector((state) => state.user);
  const [activeStep, setActiveStep] = useState(STEPS.ADDRESS);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState(items);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_OPTIONS[0].id);

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (item.variant?.price || item.product.price) * item.quantity,
    0,
  );

  const selectedShipping = SHIPPING_OPTIONS.find(
    (option) => option.id === shippingMethod,
  )!;
  const shippingCost =
    subtotal > selectedShipping.freeThreshold ? 0 : selectedShipping.price;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;

  // Fetch cart items from the server on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getUserCartItems();
        setCartItems(items);
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

  // Handle address selection
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId);
  };

  // Handle shipping method selection
  const handleShippingMethodChange = (value: string) => {
    setShippingMethod(value);
  };

  // Move to the next step
  const handleNext = () => {
    switch (activeStep) {
      case STEPS.ADDRESS:
        if (!selectedAddress) {
          dispatch(
            addToast({
              type: "error",
              title: "No address selected",
              message: "Please select or add a shipping address to continue.",
            }),
          );
          return;
        }
        setActiveStep(STEPS.SHIPPING);
        break;
      case STEPS.SHIPPING:
        if (!shippingMethod) {
          dispatch(
            addToast({
              type: "error",
              title: "No shipping method selected",
              message: "Please select a shipping method to continue.",
            }),
          );
          return;
        }
        setActiveStep(STEPS.PAYMENT);
        break;
      case STEPS.PAYMENT:
        handlePlaceOrder();
        break;
      case STEPS.CONFIRMATION:
        router.push("/");
        break;
      default:
        break;
    }
  };

  // Move to the previous step
  const handleBack = () => {
    switch (activeStep) {
      case STEPS.SHIPPING:
        setActiveStep(STEPS.ADDRESS);
        break;
      case STEPS.PAYMENT:
        setActiveStep(STEPS.SHIPPING);
        break;
      default:
        break;
    }
  };

  // Handle placing an order
  const handlePlaceOrder = async () => {
    if (!selectedAddress || !shippingMethod || cartItems.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      // Create order on the server
      await createOrder({
        shippingAddressId: selectedAddress,
        shippingMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || undefined,
          quantity: item.quantity,
        })),
        subtotal,
        shippingAmount: shippingCost,
        taxAmount: tax,
        totalAmount: total,
      });

      // Clear the cart in Redux
      dispatch(clearCart());

      // Show success message
      dispatch(
        addToast({
          type: "success",
          title: "Order placed successfully",
          message:
            "Thank you for your order! You will receive a confirmation email shortly.",
        }),
      );

      // Move to confirmation step
      setActiveStep(STEPS.CONFIRMATION);
    } catch (error) {
      console.error("Failed to place order:", error);
      dispatch(
        addToast({
          type: "error",
          title: "Failed to place order",
          message:
            "There was a problem processing your order. Please try again.",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If cart is empty, redirect to cart page
  if (cartItems.length === 0 && activeStep !== STEPS.CONFIRMATION) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center space-y-6 py-16">
          <ShoppingBag className="text-muted-foreground h-16 w-16" />
          <div className="text-center">
            <h2 className="mb-1 text-xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              You need to add items to your cart before checkout.
            </p>
            <Button asChild>
              <Link href="/category/projects">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render confirmation step
  if (activeStep === STEPS.CONFIRMATION) {
    return (
      <div className="container max-w-4xl py-16">
        <Card>
          <CardContent className="flex flex-col items-center pt-6 pb-16">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground mb-8 text-center">
              Thank you for your purchase. We have sent you an email with the
              order details.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/account/orders">View Orders</Link>
              </Button>
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main checkout content */}
        <div className="lg:col-span-2">
          <Tabs value={activeStep} className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-3">
              <TabsTrigger
                value={STEPS.ADDRESS}
                className="cursor-default"
                disabled={activeStep !== STEPS.ADDRESS}
              >
                1. Address
              </TabsTrigger>
              <TabsTrigger
                value={STEPS.SHIPPING}
                className="cursor-default"
                disabled={activeStep !== STEPS.SHIPPING}
              >
                2. Shipping
              </TabsTrigger>
              <TabsTrigger
                value={STEPS.PAYMENT}
                className="cursor-default"
                disabled={activeStep !== STEPS.PAYMENT}
              >
                3. Payment
              </TabsTrigger>
            </TabsList>

            {/* Address step */}
            <TabsContent value={STEPS.ADDRESS}>
              <CheckoutAddressForm
                addresses={addresses}
                selectedAddressId={selectedAddress}
                onAddressSelect={handleAddressSelect}
              />
            </TabsContent>

            {/* Shipping step */}
            <TabsContent value={STEPS.SHIPPING}>
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={handleShippingMethodChange}
                    className="space-y-4"
                  >
                    {SHIPPING_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2 rounded-md border p-4"
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label
                          htmlFor={option.id}
                          className="flex flex-1 cursor-pointer justify-between"
                        >
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-muted-foreground text-sm">
                              {option.description}
                            </div>
                            {subtotal > option.freeThreshold && (
                              <div className="text-sm font-medium text-green-600">
                                Free
                              </div>
                            )}
                          </div>
                          {subtotal <= option.freeThreshold && (
                            <div className="font-medium">
                              ₹{option.price.toFixed(2)}
                            </div>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment step */}
            <TabsContent value={STEPS.PAYMENT}>
              <CheckoutPaymentForm />
            </TabsContent>
          </Tabs>

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {activeStep !== STEPS.ADDRESS ? (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/cart" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Back to Cart
                </Link>
              </Button>
            )}

            <Button onClick={handleNext} disabled={isLoading} className="gap-2">
              {activeStep === STEPS.PAYMENT ? (
                <>
                  <CreditCard className="h-4 w-4" />
                  Place Order
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <CheckoutOrderSummary
            items={cartItems}
            subtotal={subtotal}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
            shippingMethod={
              SHIPPING_OPTIONS.find((option) => option.id === shippingMethod)
                ?.name || ""
            }
          />
        </div>
      </div>
    </div>
  );
}

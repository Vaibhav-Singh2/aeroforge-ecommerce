import { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}

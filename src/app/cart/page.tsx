import { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review and manage your shopping cart",
};

export default function CartRoute() {
  return <CartPage />;
}

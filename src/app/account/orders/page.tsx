import { Metadata } from "next";
import { getUserOrders } from "@/lib/actions/order-actions";
import { OrderHistory } from "@/components/account/order-history";

export const metadata: Metadata = {
  title: "Order History - Drone Store",
  description: "View your order history and track your purchases",
};

export default async function OrderHistoryPage() {
  const orders = await getUserOrders();

  return <OrderHistory orders={orders} />;
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/actions/order-actions";
import { OrderDetail } from "@/components/account/order-detail";

export const metadata: Metadata = {
  title: "Order Details - Drone Store",
  description: "View details of your order",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const order = await getOrderById({ orderId: (await params).id });

    return <OrderDetail order={order} />;
  } catch (error) {
    console.error("Error fetching order details:", error);
    notFound();
  }
}

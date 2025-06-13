"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

// Get all orders
export async function getAdminOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      orders: orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Failed to get orders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get orders",
    };
  }
}

// Get order details
export async function getAdminOrderDetails(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        address: true,
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return {
      success: true,
      order: {
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        shippedAt: order.shippedAt?.toISOString() || null,
        deliveredAt: order.deliveredAt?.toISOString() || null,
      },
    };
  } catch (error) {
    console.error("Failed to get order details:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get order details",
    };
  }
}

// Update order status from form data
export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;

  if (!orderId || !status) {
    return { success: false, error: "Order ID and status are required" };
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status as OrderStatus,
        // Update delivery timestamps based on status
        ...(status === "SHIPPED" ? { shippedAt: new Date() } : {}),
        ...(status === "DELIVERED" ? { deliveredAt: new Date() } : {}),
      },
    });

    // Revalidate the orders page to update the UI
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return {
      success: true,
      order: {
        ...updatedOrder,
        createdAt: updatedOrder.createdAt.toISOString(),
        updatedAt: updatedOrder.updatedAt.toISOString(),
        shippedAt: updatedOrder.shippedAt?.toISOString() || null,
        deliveredAt: updatedOrder.deliveredAt?.toISOString() || null,
      },
    };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update order status",
    };
  }
}

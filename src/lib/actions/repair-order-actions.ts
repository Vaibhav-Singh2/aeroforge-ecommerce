"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin/get-admin-session";
import { RepairStatus } from "@prisma/client";

// Type for repair order data
export interface RepairOrderData {
  id: string;
  repairNumber: string;
  status: string;
  deviceType: string;
  deviceModel: string;
  issueDescription: string;
  finalCost: number | null;
  completedAt: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

// Get all repair orders
export async function getRepairOrders() {
  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const repairOrders = await prisma.repairOrder.findMany({
      select: {
        id: true,
        repairNumber: true,
        status: true,
        deviceType: true,
        deviceModel: true,
        issueDescription: true,
        finalCost: true,
        completedAt: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Date objects to ISO strings for client compatibility
    const serializedOrders = repairOrders.map((order) => ({
      ...order,
      completedAt: order.completedAt ? order.completedAt.toISOString() : null,
      createdAt: order.createdAt.toISOString(),
    }));

    return { success: true, repairOrders: serializedOrders };
  } catch (error) {
    console.error("Failed to get repair orders:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get repair orders",
    };
  }
}

// Update repair order status
export async function updateRepairOrderStatus(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as RepairStatus;

  if (!orderId || !status) {
    return { success: false, error: "Order ID and status are required" };
  }

  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedOrder = await prisma.repairOrder.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    // Revalidate the repair orders page to update the UI
    revalidatePath("/admin/repair-orders");
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Failed to update repair order status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update repair order status",
    };
  }
}

// Get repair order details
export async function getRepairOrderDetails(orderId: string) {
  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const order = await prisma.repairOrder.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: true,
      },
    });

    if (!order) {
      return { success: false, error: "Repair order not found" };
    }

    return { success: true, order };
  } catch (error) {
    console.error("Failed to get repair order details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get repair order details",
    };
  }
}

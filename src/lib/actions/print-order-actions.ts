"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin/get-admin-session";
import { PrintStatus } from "@prisma/client";

// Type for print order data
export interface PrintOrderData {
  id: string;
  printNumber: string;
  status: string;
  projectName: string;
  fileUrls: string[];
  totalCost: number;
  material: string;
  completedAt: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

// Get all print orders
export async function getPrintOrders() {
  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const printOrders = await prisma.printOrder.findMany({
      select: {
        id: true,
        printNumber: true,
        status: true,
        projectName: true,
        fileUrls: true,
        totalCost: true,
        material: true,
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

    return { success: true, printOrders };
  } catch (error) {
    console.error("Failed to get print orders:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get print orders",
    };
  }
}

// Update print order status
export async function updatePrintOrderStatus(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as PrintStatus;

  if (!orderId || !status) {
    return { success: false, error: "Order ID and status are required" };
  }

  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedOrder = await prisma.printOrder.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    // Revalidate the print orders page to update the UI
    revalidatePath("/admin/print-orders");
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Failed to update print order status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update print order status",
    };
  }
}

// Get print order details
export async function getPrintOrderDetails(orderId: string) {
  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const order = await prisma.printOrder.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: true,
      },
    });

    if (!order) {
      return { success: false, error: "Print order not found" };
    }

    return { success: true, order };
  } catch (error) {
    console.error("Failed to get print order details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get print order details",
    };
  }
}

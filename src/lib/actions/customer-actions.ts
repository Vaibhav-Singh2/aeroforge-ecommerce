"use server";

import prisma from "@/lib/prisma";

// Type for customer data
export interface CustomerData {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

// Get all customers
export async function getCustomers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      customers: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Failed to get customers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get customers",
    };
  }
}

// Get customer details
export async function getCustomerDetails(customerId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: customerId,
      },
      include: {
        orders: true,
        addresses: true,
      },
    });

    if (!user) {
      return { success: false, error: "Customer not found" };
    }

    return {
      success: true,
      customer: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Failed to get customer details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get customer details",
    };
  }
}

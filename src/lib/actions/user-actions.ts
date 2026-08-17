"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Type for address input
export type AddressInput = {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
};

/**
 * Get all addresses for the current user
 */
export async function getUserAddresses() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get all addresses for the user
    const addresses = await prisma.address.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return addresses;
  } catch (error) {
    console.error("Failed to get user addresses:", error);
    throw new Error("Failed to get addresses. Please try again.");
  }
}

/**
 * Add a new address for the current user
 */
export async function addAddress(data: AddressInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // If this is set as default, unset any other default addresses of the same type
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create the new address
    // Copy the data object without the type field (if it exists)
    // TypeScript will ignore the extra field when matching against Address model
    const address = await prisma.address.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");

    return address;
  } catch (error) {
    console.error("Failed to add address:", error);
    throw new Error("Failed to add address. Please try again.");
  }
}

/**
 * Update an existing address
 */
export async function updateAddress(addressId: string, data: AddressInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    // If this is set as default, unset any other default addresses of the same type
    if (data.isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
          id: { not: addressId },
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Update the address
    const address = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");

    return address;
  } catch (error) {
    console.error("Failed to update address:", error);
    throw new Error("Failed to update address. Please try again.");
  }
}

/**
 * Delete an address
 */
export async function deleteAddress(addressId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    // Delete the address
    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete address:", error);
    throw new Error("Failed to delete address. Please try again.");
  }
}

/**
 * Set an address as default for a specific type (shipping or billing)
 */
export async function setDefaultAddress(addressId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    // Update in a transaction
    await prisma.$transaction([
      // Unset any other default addresses of the same type
      prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      }),
      // Set this address as default
      prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          isDefault: true,
        },
      }),
    ]);

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");

    return { success: true };
  } catch (error) {
    console.error("Failed to set default address:", error);
    throw new Error("Failed to set default address. Please try again.");
  }
}

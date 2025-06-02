"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserCartItems() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    return [];
  }

  const cartItems = await prisma.cartItem.findMany({
    where: {
      userId: user.id,
    },
    include: {
      product: true,
      variant: true,
    },
  });

  return cartItems;
}

export async function addToCart(
  productId: string,
  quantity: number,
  variantId?: string,
) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if the product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // If variant is provided, check if it exists
  if (variantId) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }
  }

  // Check if item is already in cart
  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      userId: user.id,
      productId,
      variantId: variantId || null,
    },
  });

  if (existingCartItem) {
    // Update the quantity
    await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: existingCartItem.quantity + quantity,
      },
    });
  } else {
    // Create a new cart item
    await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
    });
  }

  revalidatePath("/cart");
  return true;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if the cart item exists and belongs to the user
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      userId: user.id,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (quantity <= 0) {
    // Remove the item if quantity is zero or negative
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
  } else {
    // Update the quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
  return true;
}

export async function removeCartItem(itemId: string) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if the cart item exists and belongs to the user
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      userId: user.id,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Delete the cart item
  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  revalidatePath("/cart");
  return true;
}

export async function clearCart() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Delete all cart items for the user
  await prisma.cartItem.deleteMany({
    where: { userId: user.id },
  });

  revalidatePath("/cart");
  return true;
}

"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";

// Function to get the current admin session
async function getAdminSession() {
  try {
    // Get the token from the session cookie
    const cookieStore = await cookies();
    const token = cookieStore.has("admin_token")
      ? cookieStore.get("admin_token")?.value
      : undefined;

    if (!token) {
      return null;
    }

    // Verify and decode the token
    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET || "default_secret",
    );

    let adminId: string;

    try {
      const { payload } = await jose.jwtVerify(token, secret);
      adminId = payload.adminId as string;

      if (!adminId) {
        return null;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }

    // Fetch the admin from the database
    const admin = await prisma.admin.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return admin;
  } catch (error) {
    console.error("Failed to verify admin session:", error);
    return null;
  }
}

// Type for product data
export interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  price: number;
  images: string[];
  category: {
    name: string;
  };
}

// Get all products
export async function getProducts() {
  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      throw new Error("Unauthorized");
    }

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        status: true,
        price: true,
        images: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, products };
  } catch (error) {
    console.error("Failed to get products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get products",
    };
  }
}

// Delete product
export async function deleteProduct(productId: string) {
  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      throw new Error("Unauthorized");
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    // Revalidate the products page to update the UI
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

// Get product details
export async function getProductDetails(productId: string) {
  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      throw new Error("Unauthorized");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, product };
  } catch (error) {
    console.error("Failed to get product details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get product details",
    };
  }
}

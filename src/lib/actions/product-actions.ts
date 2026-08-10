"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

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
export async function deleteProduct(formData: FormData) {
  const productId = formData.get("productId") as string;

  if (!productId) {
    return { success: false, error: "Product ID is required" };
  }

  try {
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

import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminRequest } from "@/lib/admin/auth-utils";
import prisma from "@/lib/prisma";
import { deleteFromBlob } from "@/lib/blob-utils";
import { ProductStatus } from "@prisma/client";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/admin/products/[id] - Get a product by ID
export async function GET(
  request: NextRequest,
  { params }: Params,
): Promise<NextResponse> {
  try {
    // Authenticate the admin
    const admin = await authenticateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Fetch the product with related data
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: Params,
): Promise<NextResponse> {
  try {
    // Authenticate the admin
    const admin = await authenticateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const formData = await request.formData();

    // Extract product data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const sku = formData.get("sku") as string;
    const quantity = parseInt((formData.get("quantity") as string) || "0");
    const status = (formData.get("status") as string) || "ACTIVE";
    const tags = JSON.parse((formData.get("tags") as string) || "[]");
    const isFeature = formData.get("isFeature") === "true";
    const isBestseller = formData.get("isBestseller") === "true";
    const weight = parseFloat((formData.get("weight") as string) || "0");
    const trackQuantity = formData.get("trackQuantity") === "true";

    // Get existing images
    const existingImages = JSON.parse(
      (formData.get("existingImages") as string) || "[]",
    );

    // Extract all new image files
    const newImageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (
        key.startsWith("newImages") &&
        value instanceof File &&
        value.size > 0
      ) {
        newImageFiles.push(value);
      }
    }

    // Import the blob utilities directly in the handler
    const { uploadMultipleToBlob } = await import("@/lib/blob-utils");

    // Upload new images to Vercel Blob if there are any
    let newImageUrls: string[] = [];
    if (newImageFiles.length > 0) {
      newImageUrls = await uploadMultipleToBlob(newImageFiles, "products");
    }

    // Combine existing images and new images
    const allImages = [...existingImages, ...newImageUrls];

    // Generate a slug from the name (only if name changed)
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      select: { name: true, slug: true },
    });

    let slug = currentProduct?.slug || "";

    // If name changed, update the slug
    if (currentProduct && currentProduct.name !== name) {
      const newSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Check if slug exists for another product
      const existingProduct = await prisma.product.findFirst({
        where: {
          slug: newSlug,
          id: { not: id },
        },
      });

      // If slug exists, append a random string
      slug = existingProduct
        ? `${newSlug}-${Math.random().toString(36).substring(2, 7)}`
        : newSlug;
    }

    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        categoryId,
        sku,
        quantity,
        status: status as ProductStatus,
        tags,
        images: allImages,
        isFeature,
        isBestseller,
        weight,
        trackQuantity,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: Params,
): Promise<NextResponse> {
  try {
    // Authenticate the admin
    const admin = await authenticateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Get the product including its images
    const product = await prisma.product.findUnique({
      where: { id },
      select: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the product from the database
    await prisma.product.delete({
      where: { id },
    });

    // Delete all associated images from Vercel Blob
    const imageDeletePromises = product.images.map(async (imageUrl) => {
      try {
        await deleteFromBlob(imageUrl);
      } catch (error) {
        console.error(`Error deleting image ${imageUrl}:`, error);
        // Continue even if image deletion fails
      }
    });

    // Wait for all images to be deleted (or at least attempted)
    await Promise.allSettled(imageDeletePromises);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}

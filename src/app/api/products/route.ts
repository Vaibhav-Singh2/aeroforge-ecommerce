import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import { uploadMultipleToBlob } from "@/lib/blob-utils";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
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

    // Extract all files
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("images") && value instanceof File) {
        imageFiles.push(value);
      }
    }

    // Upload images to Vercel Blob if there are any
    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      imageUrls = await uploadMultipleToBlob(imageFiles, "products");
    } // Create the product in the database
    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description,
        price,
        categoryId,
        sku,
        quantity,
        status: status as ProductStatus,
        tags,
        images: imageUrls,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await request.formData();

    // Extract product data
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const sku = formData.get("sku") as string;
    const quantity = parseInt((formData.get("quantity") as string) || "0");
    const status = (formData.get("status") as string) || "ACTIVE";
    const tags = JSON.parse((formData.get("tags") as string) || "[]");

    // Get existing images
    const existingImages = JSON.parse(
      (formData.get("existingImages") as string) || "[]",
    );

    // Extract all new image files
    const newImageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("newImages") && value instanceof File) {
        newImageFiles.push(value);
      }
    }

    // Upload new images to Vercel Blob if there are any
    let newImageUrls: string[] = [];

    if (newImageFiles.length > 0) {
      newImageUrls = await uploadMultipleToBlob(newImageFiles, "products");
    }

    // Combine existing images and new images
    const allImages = [...existingImages, ...newImageUrls]; // Update the product in the database
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description,
        price,
        categoryId,
        sku,
        quantity,
        status: status as ProductStatus,
        tags,
        images: allImages,
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

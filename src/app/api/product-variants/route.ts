import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadToBlob } from "@/lib/blob-utils";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    // Extract variant data
    const productId = formData.get("productId") as string;
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const price = formData.get("price")
      ? parseFloat(formData.get("price") as string)
      : null;
    const quantity = parseInt((formData.get("quantity") as string) || "0");

    // Extract image file if there is one
    const imageFile = formData.get("image") as File | null;

    // Upload image to Vercel Blob if there is one
    let imageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToBlob(imageFile, "product-variants");
    }

    // Create the variant in the database
    const variant = await prisma.productVariant.create({
      data: {
        productId,
        name,
        sku,
        price,
        quantity,
        image: imageUrl,
      },
    });

    return NextResponse.json({ success: true, variant });
  } catch (error) {
    console.error("Error creating product variant:", error);
    return NextResponse.json(
      { error: "Failed to create product variant" },
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

    // Extract variant data
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const price = formData.get("price")
      ? parseFloat(formData.get("price") as string)
      : null;
    const quantity = parseInt((formData.get("quantity") as string) || "0");
    const existingImage = formData.get("existingImage") as string | null;

    // Extract image file if there is a new one
    const imageFile = formData.get("newImage") as File | null;

    // Upload image to Vercel Blob if there is a new one
    let imageUrl: string | null = existingImage;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToBlob(imageFile, "product-variants");
    }

    // Update the variant in the database
    const variant = await prisma.productVariant.update({
      where: { id },
      data: {
        name,
        sku,
        price,
        quantity,
        image: imageUrl,
      },
    });

    return NextResponse.json({ success: true, variant });
  } catch (error) {
    console.error("Error updating product variant:", error);
    return NextResponse.json(
      { error: "Failed to update product variant" },
      { status: 500 },
    );
  }
}

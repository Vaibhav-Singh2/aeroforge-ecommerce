import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { deleteFromBlob } from "@/lib/blob-utils";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, imageUrl } = await request.json();

    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "Product ID and Image URL are required" },
        { status: 400 },
      );
    }

    // Get the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Filter out the image to be deleted
    const updatedImages = product.images.filter(
      (url: string) => url !== imageUrl,
    );

    // Update the product in the database
    await prisma.product.update({
      where: { id: productId },
      data: { images: updatedImages },
    });

    // Delete the image from Vercel Blob
    try {
      await deleteFromBlob(imageUrl);
    } catch (error) {
      console.error("Error deleting image from Vercel Blob:", error);
      // Continue with the operation even if Blob deletion fails
    }

    return NextResponse.json({ success: true, images: updatedImages });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}

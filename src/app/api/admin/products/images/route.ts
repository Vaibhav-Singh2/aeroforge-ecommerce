import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin/auth-utils";
import prisma from "@/lib/prisma";
import { deleteFromBlob } from "@/lib/blob-utils";

// DELETE /api/admin/products/images
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the admin
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the product ID and image URL from the request
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
      select: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Filter out the image to be deleted
    const updatedImages = product.images.filter((url) => url !== imageUrl);

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

    return NextResponse.json({
      success: true,
      images: updatedImages,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}

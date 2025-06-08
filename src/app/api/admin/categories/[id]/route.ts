import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminRequest } from "@/lib/admin/auth-utils";
import prisma from "@/lib/prisma";
import { deleteFromBlob } from "@/lib/blob-utils";
import { ProductType } from "@prisma/client";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/admin/categories/[id] - Get a category by ID
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

    // Fetch the category
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/categories/[id] - Update a category
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

    // Extract category data
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";
    const type = formData.get("type") as string;
    const isActive = formData.get("isActive") === "true";
    const keepExistingImage = formData.get("keepExistingImage") === "true";

    // Find the current category
    const currentCategory = await prisma.category.findUnique({
      where: { id },
      select: { imageUrl: true, name: true },
    });

    if (!currentCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Handle image update
    let imageUrl = keepExistingImage ? currentCategory.imageUrl : null;
    const imageFile = formData.get("image") as File | null;

    // If new image provided, upload it and delete the old one
    if (imageFile && imageFile.size > 0) {
      const { uploadToBlob } = await import("@/lib/blob-utils");
      imageUrl = await uploadToBlob(imageFile, "categories");

      // Delete old image if exists and different from new one
      if (
        currentCategory.imageUrl &&
        !keepExistingImage &&
        currentCategory.imageUrl !== imageUrl
      ) {
        try {
          await deleteFromBlob(currentCategory.imageUrl);
        } catch (error) {
          console.error("Error deleting old category image:", error);
          // Continue even if deletion fails
        }
      }
    }

    // Generate new slug if name changed
    let slug = undefined;
    if (currentCategory.name !== name) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Check if slug exists for another category
      const existingCategory = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: "A category with this name already exists" },
          { status: 400 },
        );
      }
    }

    // Update the category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: slug as string | undefined,
        description,
        type: type as ProductType,
        isActive,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete a category
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

    // Check if category has associated products
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json({
        error: `Cannot delete category with ${productsCount} associated products`,
        status: 400,
      });
    }

    // Get category to retrieve image URL
    const category = await prisma.category.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    // Delete the image from Vercel Blob if it exists
    if (category.imageUrl) {
      try {
        await deleteFromBlob(category.imageUrl);
      } catch (error) {
        console.error("Error deleting category image:", error);
        // Continue even if image deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}

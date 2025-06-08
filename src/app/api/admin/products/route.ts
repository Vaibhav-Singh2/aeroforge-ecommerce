import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminRequest } from "@/lib/admin/auth-utils";
import prisma from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

// GET /api/admin/products - Fetch all products with category
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the admin user
    const admin = await authenticateAdminRequest(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query params for pagination and filtering if needed
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status");

    // Build where clause for filtering
    const whereClause: {
      OR?: {
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
        slug?: { contains: string; mode: "insensitive" };
      }[];
      categoryId?: string;
      status?: ProductStatus;
    } = {};

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { slug: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category) {
      whereClause.categoryId = category;
    }

    if (
      status &&
      Object.values(ProductStatus).includes(status as ProductStatus)
    ) {
      whereClause.status = status as ProductStatus;
    }

    // Fetch products with their categories
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the admin user
    const admin = await authenticateAdminRequest(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Extract all files
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("images") && value instanceof File && value.size > 0) {
        imageFiles.push(value);
      }
    }

    // Use the blob utilities directly from the handler
    const { uploadMultipleToBlob } = await import("@/lib/blob-utils");

    // Upload images to Vercel Blob if there are any
    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      imageUrls = await uploadMultipleToBlob(imageFiles, "products");
    }

    // Generate a slug from the name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    // If slug exists, append a random string
    const finalSlug = existingProduct
      ? `${slug}-${Math.random().toString(36).substring(2, 7)}`
      : slug;

    // Create the product in the database
    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description,
        price,
        categoryId,
        sku,
        quantity,
        status: status as ProductStatus,
        tags,
        images: imageUrls,
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
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

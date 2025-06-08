import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminRequest } from "@/lib/admin/auth-utils";
import { OrderStatus, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

// GET /api/admin/orders - Get all orders
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the admin
    const admin = await authenticateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering and pagination
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "desc";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const where: Prisma.OrderWhereInput = {};

    // Add status filter if provided
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status as OrderStatus;
    }

    // Add search filter if provided
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Get orders with pagination and filtering
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
          shippingAddress: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: sort === "asc" ? "asc" : "desc",
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

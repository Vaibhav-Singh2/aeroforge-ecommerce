import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin/auth-utils";
import prisma from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/admin/orders/[id] - Get an order by ID
export async function GET(
  request: NextRequest,
  { params }: Params,
): Promise<NextResponse> {
  try {
    // Authenticate the admin
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Fetch the order with related data
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            phone: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                price: true,
              },
            },
            productVariant: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/orders/[id] - Update an order's status
export async function PUT(
  request: NextRequest,
  { params }: Params,
): Promise<NextResponse> {
  try {
    // Authenticate the admin
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { status, trackingNumber, notes } = await request.json();

    // Update the order
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber,
        notes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      order,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}

// This endpoint doesn't allow deletion of orders for data integrity
// But we can implement a soft delete by updating status to CANCELLED if needed

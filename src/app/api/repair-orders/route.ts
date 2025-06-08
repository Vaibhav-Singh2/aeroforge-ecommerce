import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get the current authenticated user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the clerkUserId
    const clerkUserId = user.id;

    // Get the database user
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all repair orders for this user
    const repairOrders = await prisma.repairOrder.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        repairNumber: true,
        deviceType: true,
        deviceModel: true,
        deviceBrand: true,
        status: true,
        createdAt: true,
        estimatedCost: true,
      },
    });

    return NextResponse.json({ repairOrders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching repair orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch repair orders" },
      { status: 500 },
    );
  }
}

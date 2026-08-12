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

    // Get all print orders for this user
    const printOrders = await prisma.printOrder.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        printNumber: true,
        projectName: true,
        material: true,
        quantity: true,
        status: true,
        createdAt: true,
        totalCost: true,
      },
    });

    return NextResponse.json({ printOrders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching print orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch print orders" },
      { status: 500 },
    );
  }
}

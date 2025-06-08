import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

    // Get the repair order
    const repairOrder = await prisma.repairOrder.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    });

    if (!repairOrder) {
      return NextResponse.json(
        { error: "Repair order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ repairOrder }, { status: 200 });
  } catch (error) {
    console.error("Error fetching repair order:", error);
    return NextResponse.json(
      { error: "Failed to fetch repair order" },
      { status: 500 },
    );
  }
}

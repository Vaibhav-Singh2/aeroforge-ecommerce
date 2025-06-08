import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

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

    // Get the print order
    const printOrder = await prisma.printOrder.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    });

    if (!printOrder) {
      return NextResponse.json(
        { error: "Print order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ printOrder }, { status: 200 });
  } catch (error) {
    console.error("Error fetching print order:", error);
    return NextResponse.json(
      { error: "Failed to fetch print order" },
      { status: 500 },
    );
  }
}

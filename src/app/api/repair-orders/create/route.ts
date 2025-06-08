import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    // Get the current authenticated user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the clerk user id
    const clerkUserId = user.id;

    // Find the database user
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse the request body
    const body = await request.json();
    const {
      deviceType,
      deviceModel,
      deviceBrand,
      issueDescription,
      contactPhone,
      images,
    } = body;

    // Validate required fields
    if (!deviceType || !deviceModel || !issueDescription || !contactPhone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate a unique repair number (e.g., REP-XXXX)
    const repairNumber = `REP-${nanoid(8).toUpperCase()}`;

    // Create the repair order in the database
    const repairOrder = await prisma.repairOrder.create({
      data: {
        userId: dbUser.id,
        repairNumber,
        deviceType,
        deviceModel,
        deviceBrand,
        issueDescription,
        contactPhone,
        images: images || [],
        status: "QUOTE_REQUESTED",
        paidAmount: 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        repairOrder: {
          id: repairOrder.id,
          repairNumber: repairOrder.repairNumber,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating repair order:", error);
    return NextResponse.json(
      { error: "Failed to create repair order" },
      { status: 500 },
    );
  }
}

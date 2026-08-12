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
      projectName,
      description,
      quantity,
      material,
      color,
      infill,
      layerHeight,
      printQuality,
      isRush,
      needsSupports,
      postProcessingOptions,
      fileUrls,
      images,
    } = body;

    // Validate required fields
    if (!projectName || !material || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate a unique print number (e.g., PRT-XXXX)
    const printNumber = `PRT-${nanoid(8).toUpperCase()}`;

    // Create the print order in the database
    const printOrder = await prisma.printOrder.create({
      data: {
        userId: dbUser.id,
        printNumber,
        projectName,
        description,
        quantity,
        material,
        color,
        infill,
        layerHeight,
        printQuality,
        isRush: isRush || false,
        needsSupports: needsSupports || false,
        postProcessing: postProcessingOptions || [],
        fileUrls: fileUrls || [],
        images: images || [],
        status: "QUOTE_REQUESTED",
        paidAmount: 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        printOrder: {
          id: printOrder.id,
          printNumber: printOrder.printNumber,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating print order:", error);
    return NextResponse.json(
      { error: "Failed to create print order" },
      { status: 500 },
    );
  }
}

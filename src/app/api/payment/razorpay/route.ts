import { NextRequest, NextResponse } from "next/server";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
} from "@/lib/razorpay-utils";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { orderId, amount, receipt } = body;

    // Validate required fields
    if (!orderId || !amount || !receipt) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Create Razorpay order
    try {
      const razorpayOrder = await createRazorpayOrder(amount, receipt, {
        order_id: orderId,
      });

      // Update the order with Razorpay order ID
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentIntentId: razorpayOrder.id,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          receipt: razorpayOrder.receipt,
        },
      });
    } catch (error) {
      console.error("Razorpay order creation error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create payment" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature, razorpayOrderId } = body;

    // Validate required fields
    if (!orderId || !paymentId || !signature || !razorpayOrderId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Verify the payment signature
    const isValidSignature = verifyRazorpaySignature(
      razorpayOrderId,
      paymentId,
      signature,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    // Update order payment status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: "razorpay",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: updatedOrder.id,
        status: updatedOrder.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}

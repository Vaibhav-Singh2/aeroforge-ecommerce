import { NextRequest, NextResponse } from "next/server";
import { RazorpayWebhookPaymentPayload } from "@/lib/types/razorpay";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // Get webhook signature from headers
    const webhookSignature = req.headers.get("x-razorpay-signature");
    if (!webhookSignature) {
      return NextResponse.json(
        { success: false, error: "Missing webhook signature" },
        { status: 400 },
      );
    }

    // Get webhook payload
    const payload = await req.text();

    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(
      payload,
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET || "",
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature" },
        { status: 400 },
      );
    }

    // Process the webhook payload
    const webhookData = JSON.parse(payload) as RazorpayWebhookPaymentPayload;
    const event = webhookData.event;

    switch (event) {
      case "payment.authorized":
      case "payment.captured":
        await handlePaymentSuccess(webhookData);
        break;
      case "payment.failed":
        await handlePaymentFailure(webhookData);
        break;
      case "refund.processed":
        await handleRefundProcessed(webhookData);
        break;
      default:
        // Log unhandled event type
        console.log(`Unhandled webhook event: ${event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process webhook" },
      { status: 500 },
    );
  }
}

// Helper function to verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return expectedSignature === signature;
}

// Handle successful payment
async function handlePaymentSuccess(
  webhookData: RazorpayWebhookPaymentPayload,
) {
  const payment = webhookData.payload.payment.entity;
  const orderId = payment.notes.order_id;

  if (!orderId) {
    console.error("Order ID not found in payment notes");
    return;
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "razorpay",
    },
  });
}

// Handle failed payment
async function handlePaymentFailure(
  webhookData: RazorpayWebhookPaymentPayload,
) {
  const payment = webhookData.payload.payment.entity;
  const orderId = payment.notes.order_id;

  if (!orderId) {
    console.error("Order ID not found in payment notes");
    return;
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      paymentStatus: PaymentStatus.FAILED,
    },
  });
}

// Handle refund processed
async function handleRefundProcessed(
  webhookData: RazorpayWebhookPaymentPayload,
) {
  const payment = webhookData.payload.payment.entity;
  const orderId = payment.notes.order_id;

  if (!orderId) {
    console.error("Order ID not found in payment notes");
    return;
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      paymentStatus: PaymentStatus.REFUNDED,
    },
  });
}

/**
 * Razorpay payment utilities
 */
import Razorpay from "razorpay";
import {
  RazorpayOptions,
  RazorpayOrderResponse,
  RazorpaySuccessResponse,
} from "./types/razorpay";
import crypto from "crypto";

// Initialize Razorpay server-side instance
export const createRazorpayInstance = (): Razorpay => {
  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });
};

// Create a Razorpay order
export const createRazorpayOrder = async (
  amount: number,
  receipt: string,
  notes: Record<string, string> = {},
): Promise<RazorpayOrderResponse> => {
  const razorpay = createRazorpayInstance();

  // Amount should be in smallest currency unit (paise for INR)
  const amountInPaise = Math.round(amount * 100);

  const orderOptions = {
    amount: amountInPaise,
    currency: "INR",
    receipt,
    notes,
    payment_capture: 1, // Auto-capture payment
  };

  const order = await razorpay.orders.create(orderOptions);

  // Convert to our expected response type
  return {
    id: order.id,
    entity: order.entity,
    amount:
      typeof order.amount === "string"
        ? parseInt(order.amount, 10)
        : order.amount,
    amount_paid:
      typeof order.amount_paid === "string"
        ? parseInt(order.amount_paid, 10)
        : order.amount_paid,
    amount_due:
      typeof order.amount_due === "string"
        ? parseInt(order.amount_due, 10)
        : order.amount_due,
    currency: order.currency,
    receipt: order.receipt || receipt, // Use passed receipt if not in response
    status: order.status,
    attempts: order.attempts,
    notes: convertNotesToStringRecord(order.notes) || notes,
    created_at: order.created_at,
  };
};

// Helper function to convert Razorpay notes to string record
function convertNotesToStringRecord(
  notes: Record<string, unknown> | null | undefined,
): Record<string, string> {
  if (!notes) return {};

  const result: Record<string, string> = {};

  Object.keys(notes).forEach((key) => {
    const value = notes[key];
    result[key] = value !== null && value !== undefined ? String(value) : "";
  });

  return result;
}

// Verify Razorpay signature
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string,
): boolean => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};

// Prepare options for client-side Razorpay checkout
export const prepareRazorpayCheckoutOptions = (
  orderData: {
    id: string;
    amount: number;
    receipt: string;
  },
  customerData: {
    name: string;
    email: string;
    contact: string;
  },
  handler: (response: RazorpaySuccessResponse) => void,
  onDismiss?: () => void,
): RazorpayOptions => {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    amount: orderData.amount, // Amount in paise
    currency: "INR",
    name: "ProjectsLab E-commerce",
    description: `Order #${orderData.receipt}`,
    order_id: orderData.id,
    handler,
    prefill: {
      name: customerData.name,
      email: customerData.email,
      contact: customerData.contact,
    },
    notes: {
      order_id: orderData.receipt,
    },
    theme: {
      color: "#6366F1", // Indigo color from Tailwind
    },
    modal: {
      ondismiss: onDismiss,
      escape: true,
      animation: true,
    },
  };
};

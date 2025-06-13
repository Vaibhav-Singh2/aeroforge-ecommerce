"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { generateOrderNumber } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma";

// Define types for our order actions
type CreateOrderInput = {
  shippingAddressId: string;
  shippingMethod: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  customerNotes?: string;
};

type GetOrderInput = {
  orderId: string;
};

/**
 * Creates a new order in the database
 */
export async function createOrder(input: CreateOrderInput) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Validate shipping address
    const shippingAddress = await prisma.address.findFirst({
      where: {
        id: input.shippingAddressId,
        userId: user.id,
      },
    });

    if (!shippingAddress) {
      throw new Error("Invalid shipping address");
    }

    // Generate unique order number (YYYYMMDD-XXXX format)
    const orderNumber = generateOrderNumber();

    // Get product and variant details for all items
    const orderItems = await Promise.all(
      input.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        let variant = null;
        if (item.variantId) {
          variant = await prisma.productVariant.findUnique({
            where: { id: item.variantId },
          });

          if (!variant) {
            throw new Error(`Variant not found: ${item.variantId}`);
          }
        }

        return {
          productId: product.id,
          variantId: variant?.id,
          quantity: item.quantity,
          price: variant?.price || product.price,
          name: product.name,
          image: product.images[0] || null,
        };
      }),
    );

    // Create the order in a transaction
    const order = await prisma.$transaction(async (prisma) => {
      // 1. Create the order
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId: user.id,
          subtotal: input.subtotal,
          taxAmount: input.taxAmount,
          shippingAmount: input.shippingAmount,
          totalAmount: input.totalAmount,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          shippingAddressId: shippingAddress.id,
          shippingMethod: input.shippingMethod,
          customerNotes: input.customerNotes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Clear the user's cart
      await prisma.cartItem.deleteMany({
        where: {
          userId: user.id,
        },
      });

      // 3. Update product/variant inventory (if needed)
      for (const item of input.items) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        } else {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return newOrder;
    });

    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/account/orders");

    return order;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw new Error("Failed to create order. Please try again.");
  }
}

/**
 * Get all orders for the current user
 */
export async function getUserOrders() {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get all orders for the user
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                slug: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (error) {
    console.error("Failed to get user orders:", error);
    throw new Error("Failed to get orders. Please try again.");
  }
}

/**
 * Get a specific order by ID
 */
export async function getOrderById(input: GetOrderInput) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get order details
    const order = await prisma.order.findFirst({
      where: {
        id: input.orderId,
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                slug: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error("Failed to get order details:", error);
    throw new Error("Failed to get order details. Please try again.");
  }
}

/**
 * Get all orders for admin
 */
export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      orders: orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Failed to get orders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get orders",
    };
  }
}

/**
 * Get order details for admin
 */
export async function getOrderDetails(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return {
      success: true,
      order: {
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Failed to get order details:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get order details",
    };
  }
}

/**
 * Update order status - supports both FormData (admin UI) and direct parameter calls
 */
export async function updateOrderStatus(
  formDataOrOrderId: FormData | string,
  statusParam?: OrderStatus,
  paymentStatusParam?: PaymentStatus,
) {
  try {
    let orderId: string;
    let status: OrderStatus;
    let paymentStatus: PaymentStatus | undefined;
    const isFormData = formDataOrOrderId instanceof FormData;

    // Handle different input formats
    if (isFormData) {
      // Case 1: Called from admin UI form
      const formData = formDataOrOrderId as FormData;
      orderId = formData.get("orderId") as string;
      status = formData.get("status") as string as OrderStatus;

      // Optional payment status from form
      const paymentStatusStr = formData.get("paymentStatus") as string;
      if (paymentStatusStr) {
        paymentStatus = paymentStatusStr as PaymentStatus;
      }

      if (!orderId || !status) {
        return { success: false, error: "Order ID and status are required" };
      }
    } else {
      // Case 2: Called programmatically with direct parameters
      orderId = formDataOrOrderId as string;
      status = statusParam as OrderStatus;
      paymentStatus = paymentStatusParam;

      if (!orderId || !status) {
        throw new Error("Order ID and status are required");
      }

      // For direct API calls, get authenticated user (future admin check)
      const { userId } = await auth();
      if (!userId) {
        throw new Error("Authentication required");
      }
    } // Prepare update data
    const updateData: {
      status: OrderStatus;
      paymentStatus?: PaymentStatus;
    } = { status };

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: updateData,
    });

    // Revalidate all relevant paths
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/account/orders");
    revalidatePath(`/account/orders/${orderId}`);

    // Return appropriate response based on call type
    if (isFormData) {
      return {
        success: true,
        order: {
          ...updatedOrder,
          createdAt: updatedOrder.createdAt.toISOString(),
          updatedAt: updatedOrder.updatedAt.toISOString(),
        },
      };
    } else {
      return updatedOrder;
    }
  } catch (error) {
    console.error("Failed to update order status:", error);

    // Return appropriate error format based on call type
    if (formDataOrOrderId instanceof FormData) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update order status",
      };
    } else {
      throw new Error("Failed to update order status. Please try again.");
    }
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: string) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Only allow cancellation if order is pending or confirmed
    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CONFIRMED
    ) {
      throw new Error("This order cannot be cancelled");
    }

    // Cancel the order in a transaction
    await prisma.$transaction(async (prisma) => {
      // 1. Update order status to cancelled
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });

      // 2. Restore product/variant inventory
      for (const item of order.items) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });
        } else {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    });

    revalidatePath("/account/orders");
    revalidatePath(`/account/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel order:", error);
    throw new Error("Failed to cancel order. Please try again.");
  }
}

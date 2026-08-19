"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export interface CreateReviewInput {
  productId: string;
  productSlug: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export async function createOrUpdateReview(input: CreateReviewInput) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return { success: false, error: "You must be signed in to write a review." };
    }

    if (input.rating < 1 || input.rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5 stars." };
    }

    if (!input.comment.trim()) {
      return { success: false, error: "Please provide review feedback." };
    }

    // Find or ensure User in MongoDB
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!dbUser) {
      const user = await currentUser();
      if (!user) {
        return { success: false, error: "User profile not found." };
      }

      dbUser = await prisma.user.create({
        data: {
          clerkUserId,
          email: user.emailAddresses[0]?.emailAddress || `${clerkUserId}@example.com`,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "AeroForge Pilot",
          imageUrl: user.imageUrl,
        },
      });
    }

    // Check if user has purchased this product for verified badge
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: input.productId,
        order: {
          userId: dbUser.id,
          status: { in: ["DELIVERED", "SHIPPED", "CONFIRMED"] },
        },
      },
    });

    // Upsert review (unique userId_productId)
    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: dbUser.id,
          productId: input.productId,
        },
      },
      update: {
        rating: input.rating,
        title: input.title.trim(),
        comment: input.comment.trim(),
        images: input.images || [],
        isVerified: Boolean(hasPurchased),
        isApproved: true,
      },
      create: {
        userId: dbUser.id,
        productId: input.productId,
        rating: input.rating,
        title: input.title.trim(),
        comment: input.comment.trim(),
        images: input.images || [],
        isVerified: Boolean(hasPurchased),
        isApproved: true,
      },
    });

    revalidatePath(`/product/${input.productSlug}`);
    return { success: true, review };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "Failed to submit review. Please try again." };
  }
}

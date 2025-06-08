import { PrismaClient } from "@prisma/client";
import { handleEntityImageCleanup } from "./blob-cleanup";

/**
 * Extends the PrismaClient with middleware to automatically clean up images
 * when entities with images are deleted
 */
export function setupPrismaMiddleware(prisma: PrismaClient): void {
  // Middleware for Product model - clean up images when products are deleted
  prisma.$use(async (params, next) => {
    // Handle Product deletion
    if (params.action === "delete" && params.model === "Product") {
      // Single product deletion
      if (params.args.where?.id) {
        // Get the product images before deletion
        const product = await prisma.product.findUnique({
          where: params.args.where,
          select: { images: true },
        });

        // Perform the deletion
        const result = await next(params);

        // Delete the images after product is deleted
        if (product?.images?.length) {
          await handleEntityImageCleanup(product.images);
        }

        return result;
      }
      // Bulk deletion (deleteMany)
      else {
        // Find all products matching the where condition
        const products = await prisma.product.findMany({
          where: params.args.where,
          select: { images: true },
        });

        // Collect all image URLs
        const allImageUrls = products.flatMap((p) => p.images);

        // Perform the deletion
        const result = await next(params);

        // Delete all images
        if (allImageUrls.length > 0) {
          await handleEntityImageCleanup(allImageUrls);
        }

        return result;
      }
    }

    // Handle Category deletion - clean up the category image
    if (params.action === "delete" && params.model === "Category") {
      // Single category deletion
      if (params.args.where?.id) {
        // Get the category image before deletion
        const category = await prisma.category.findUnique({
          where: params.args.where,
          select: { imageUrl: true },
        });

        // Perform the deletion
        const result = await next(params);

        // Delete the image if it exists
        if (category?.imageUrl) {
          await handleEntityImageCleanup(category.imageUrl);
        }

        return result;
      }
      // Bulk deletion
      else {
        // Find all categories matching the where condition
        const categories = await prisma.category.findMany({
          where: params.args.where,
          select: { imageUrl: true },
        });

        // Collect all image URLs (non-null)
        const allImageUrls = categories
          .map((c) => c.imageUrl)
          .filter((url): url is string => !!url);

        // Perform the deletion
        const result = await next(params);

        // Delete all images
        if (allImageUrls.length > 0) {
          await handleEntityImageCleanup(allImageUrls);
        }

        return result;
      }
    }

    // Add more models with image fields as needed

    // Default: just pass through
    return next(params);
  });
}

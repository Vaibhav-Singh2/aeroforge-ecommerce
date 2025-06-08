import { deleteFromBlob } from "@/lib/blob-utils";

/**
 * Utility function to delete files from Vercel Blob storage
 * @param urls Array of URLs to delete
 * @returns Array of results (success/failure for each URL)
 */
export async function deleteFilesFromBlob(
  urls: string[],
): Promise<{ url: string; success: boolean }[]> {
  if (!urls || urls.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(
    urls.map((url) => deleteFromBlob(url)),
  );

  return results.map((result, index) => {
    return {
      url: urls[index],
      success: result.status === "fulfilled",
    };
  });
}

/**
 * Deletes a file from Vercel Blob storage and logs any errors
 * Use this when you want to delete a file but don't want to throw an error if it fails
 * @param url URL of the file to delete
 * @returns boolean indicating success or failure
 */
export async function safeDeleteFromBlob(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    await deleteFromBlob(url);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${url} from Vercel Blob:`, error);
    return false;
  }
}

/**
 * A middleware function to handle image cleanup when entities are deleted
 * This can be used with Prisma middleware to automatically delete images when records are deleted
 *
 * Usage example:
 * ```
 * // In a Prisma middleware setup file
 * prisma.$use(async (params, next) => {
 *   if (params.action === 'delete' && params.model === 'Product') {
 *     // Get the product images before deletion
 *     const product = await prisma.product.findUnique({
 *       where: params.args.where,
 *       select: { images: true }
 *     });
 *
 *     // Perform the deletion
 *     const result = await next(params);
 *
 *     // Delete the images after product is deleted
 *     if (product?.images?.length) {
 *       await handleEntityImageCleanup(product.images);
 *     }
 *
 *     return result;
 *   }
 *   return next(params);
 * });
 * ```
 */
export async function handleEntityImageCleanup(
  imageUrls: string | string[],
): Promise<void> {
  const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

  if (urls.length === 0) return;

  // Delete all images in parallel but don't throw if some fail
  const results = await deleteFilesFromBlob(urls);

  // Log any failures
  const failures = results.filter((r) => !r.success);
  if (failures.length > 0) {
    console.error(
      `Failed to delete ${failures.length} images:`,
      failures.map((f) => f.url).join(", "),
    );
  }
}

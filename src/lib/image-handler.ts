import {
  uploadToBlob,
  uploadMultipleToBlob,
  deleteFromBlob,
} from "./blob-utils";

/**
 * Utility for handling image uploads and management with Vercel Blob
 */
export class ImageHandler {
  /**
   * Upload a single image to Vercel Blob
   * @param file The file to upload
   * @param folder The folder to store the image in
   * @returns The URL of the uploaded image
   */
  static async uploadImage(
    file: File,
    folder: string = "uploads",
  ): Promise<string> {
    return await uploadToBlob(file, folder);
  }

  /**
   * Upload multiple images to Vercel Blob
   * @param files The files to upload
   * @param folder The folder to store the images in
   * @returns An array of URLs of the uploaded images
   */
  static async uploadImages(
    files: File[],
    folder: string = "uploads",
  ): Promise<string[]> {
    return await uploadMultipleToBlob(files, folder);
  }

  /**
   * Delete an image from Vercel Blob
   * @param url The URL of the image to delete
   * @returns A promise that resolves when the image is deleted
   */
  static async deleteImage(url: string): Promise<void> {
    return await deleteFromBlob(url);
  }

  /**
   * Replace an image in Vercel Blob (delete old + upload new)
   * @param oldUrl The URL of the old image to replace
   * @param newFile The new file to upload
   * @param folder The folder to store the new image in
   * @returns The URL of the new image
   */
  static async replaceImage(
    oldUrl: string | null,
    newFile: File,
    folder: string = "uploads",
  ): Promise<string> {
    // Upload new image
    const newUrl = await uploadToBlob(newFile, folder);

    // Delete old image if it exists
    if (oldUrl) {
      try {
        await deleteFromBlob(oldUrl);
      } catch (error) {
        console.warn("Failed to delete old image:", error);
        // Continue even if deletion fails
      }
    }

    return newUrl;
  }

  /**
   * Process images for an entity that may have both existing images and new files
   * @param existingUrls Existing image URLs
   * @param newFiles New image files to upload
   * @param folder The folder to store new images in
   * @returns Updated array of all image URLs
   */
  static async processEntityImages(
    existingUrls: string[] = [],
    newFiles: File[] = [],
    folder: string = "uploads",
  ): Promise<string[]> {
    // If no new files, return existing URLs
    if (newFiles.length === 0) {
      return existingUrls;
    }

    // Upload new files
    const newUrls = await uploadMultipleToBlob(newFiles, folder);

    // Combine existing and new URLs
    return [...existingUrls, ...newUrls];
  }

  /**
   * Filter out images to delete and keep the rest
   * @param allUrls All current image URLs
   * @param urlsToDelete URLs to delete
   * @param deleteFromStorage Whether to delete from Blob storage
   * @returns Updated array of image URLs
   */
  static async filterImages(
    allUrls: string[] = [],
    urlsToDelete: string[] = [],
    deleteFromStorage: boolean = true,
  ): Promise<string[]> {
    // If no URLs to delete, return all URLs
    if (urlsToDelete.length === 0) {
      return allUrls;
    }

    // Delete from storage if requested
    if (deleteFromStorage) {
      const deletePromises = urlsToDelete.map((url) => {
        try {
          return deleteFromBlob(url);
        } catch (error) {
          console.warn(`Failed to delete image ${url}:`, error);
          return Promise.resolve();
        }
      });

      await Promise.all(deletePromises);
    }

    // Return filtered URLs
    return allUrls.filter((url) => !urlsToDelete.includes(url));
  }
}

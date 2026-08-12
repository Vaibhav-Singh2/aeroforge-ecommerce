import { put, list, del, ListBlobResult } from "@vercel/blob";
import { nanoid } from "nanoid";

/**
 * Uploads a file to Vercel Blob storage
 * @param file File to upload
 * @param folder Optional folder path to store the file in
 * @returns URL of the uploaded file
 */
export async function uploadToBlob(
  file: File,
  folder: string = "uploads",
): Promise<string> {
  try {
    // Generate a unique filename with sanitized original file name
    const sanitizedName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_.]/g, "");
    const filename = `${folder}/${nanoid()}-${sanitizedName}`;

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
      token: process.env.NEXT_PUBLIC_VERCEL_BLOB_TOKEN,
    });

    return url;
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    throw new Error("Failed to upload file");
  }
}

/**
 * Uploads multiple files to Vercel Blob storage
 * @param files Array of files to upload
 * @param folder Optional folder path to store the files in
 * @returns Array of URLs of the uploaded files
 */
export async function uploadMultipleToBlob(
  files: File[],
  folder: string = "uploads",
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToBlob(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Deletes a file from Vercel Blob storage
 * @param url URL of the file to delete
 * @returns void
 */
export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url, { token: process.env.NEXT_PUBLIC_VERCEL_BLOB_TOKEN });
  } catch (error) {
    console.error("Error deleting from Vercel Blob:", error);
    throw new Error("Failed to delete file");
  }
}

/**
 * Lists all files in a folder in Vercel Blob storage
 * @param prefix Folder prefix to list files from
 * @returns Array of blob objects
 */
export async function listBlobFiles(
  prefix: string = "uploads",
): Promise<ListBlobResult> {
  try {
    return await list({
      prefix,
      token: process.env.NEXT_PUBLIC_VERCEL_BLOB_TOKEN,
    });
  } catch (error) {
    console.error("Error listing files from Vercel Blob:", error);
    throw new Error("Failed to list files");
  }
}

/**
 * Extracts path from a Blob URL
 * @param url The blob URL
 * @returns Path in the blob storage
 */
export function getBlobPathFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Remove the first slash if it exists
    return pathname.startsWith("/") ? pathname.substring(1) : pathname;
  } catch (error) {
    console.error("Error extracting path from Blob URL:", error);
    throw new Error("Invalid Blob URL");
  }
}

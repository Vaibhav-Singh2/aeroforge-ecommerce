"use client";

import { useState, useCallback } from "react";

interface UseImageUploadOptions {
  maxFiles?: number;
  folder?: string;
  endpoint?: "upload" | "upload-multiple";
  onUploadSuccess?: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
}

interface UseImageUploadReturn {
  isUploading: boolean;
  error: string | null;
  uploadImages: (files: FileList | null) => Promise<string[]>;
}

/**
 * Custom hook for handling image uploads to Vercel Blob
 */
export function useImageUpload({
  maxFiles = 10,
  folder = "uploads",
  endpoint = "upload-multiple",
  onUploadSuccess,
  onUploadError,
}: UseImageUploadOptions = {}): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImages = useCallback(
    async (files: FileList | null): Promise<string[]> => {
      if (!files || files.length === 0) {
        return [];
      }

      setIsUploading(true);
      setError(null);

      try {
        const filesToUpload = Array.from(files).slice(0, maxFiles);
        const formData = new FormData();

        if (endpoint === "upload-multiple") {
          // Add all files for bulk upload
          filesToUpload.forEach((file) => {
            formData.append("files", file);
          });
          formData.append("folder", folder);

          const response = await fetch("/api/upload-multiple", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to upload files");
          }

          onUploadSuccess?.(data.urls);
          return data.urls;
        } else {
          // Upload files one by one
          const urls: string[] = [];

          for (const file of filesToUpload) {
            const fileFormData = new FormData();
            fileFormData.append("file", file);
            fileFormData.append("folder", folder);

            const response = await fetch("/api/upload", {
              method: "POST",
              body: fileFormData,
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || "Failed to upload file");
            }

            urls.push(data.url);
          }

          onUploadSuccess?.(urls);
          return urls;
        }
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Unknown upload error");
        console.error("Error uploading files:", err);
        setError(err.message);
        onUploadError?.(err);
        return [];
      } finally {
        setIsUploading(false);
      }
    },
    [maxFiles, folder, endpoint, onUploadSuccess, onUploadError],
  );

  return {
    isUploading,
    error,
    uploadImages,
  };
}

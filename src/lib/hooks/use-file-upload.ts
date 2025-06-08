"use client";

import { useState, useCallback } from "react";

interface UseFileUploadProps {
  maxFiles?: number;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onUploadSuccess?: (files: { name: string; url: string }[]) => void;
  onUploadError?: (error: string) => void;
}

export function useFileUpload({
  maxFiles = 5,
  maxSizeInMB = 50,
  allowedTypes = ["model/stl", "model/obj", ".stl", ".obj"],
  onUploadSuccess,
  onUploadError,
}: UseFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        return { valid: false, error: "No files selected" };
      }

      if (files.length > maxFiles) {
        return {
          valid: false,
          error: `You can upload a maximum of ${maxFiles} files at once`,
        };
      }

      // Check file types and sizes
      let invalidType = false;
      let invalidSize = false;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check if the file type is allowed
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
        const fileType = file.type.toLowerCase();

        const isTypeAllowed =
          allowedTypes.includes(fileType) ||
          allowedTypes.includes(fileExtension);

        if (!isTypeAllowed) {
          invalidType = true;
          break;
        }

        // Check if the file size is within limits
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > maxSizeInMB) {
          invalidSize = true;
          break;
        }
      }

      if (invalidType) {
        return {
          valid: false,
          error: `Only ${allowedTypes.join(", ")} files are allowed`,
        };
      }

      if (invalidSize) {
        return {
          valid: false,
          error: `Files must be smaller than ${maxSizeInMB}MB`,
        };
      }

      return { valid: true, error: null };
    },
    [maxFiles, maxSizeInMB, allowedTypes],
  );

  const uploadFiles = useCallback(
    async (files: FileList | null) => {
      setError(null);

      // Validate files
      const { valid, error: validationError } = validateFiles(files);
      if (!valid) {
        setError(validationError);
        if (onUploadError)
          onUploadError(validationError || "Error validating files");
        return;
      }

      if (!files || files.length === 0) return;

      setIsUploading(true);

      try {
        // In a real implementation, you would upload these files to storage
        // For demonstration purposes, we'll create mock URLs
        const uploadedFiles = Array.from(files).map((file) => ({
          name: file.name,
          // In actual implementation, this would be an uploaded URL
          url: URL.createObjectURL(file),
        }));

        if (onUploadSuccess) {
          onUploadSuccess(uploadedFiles);
        }
      } catch (err) {
        const errorMessage = "Failed to upload files. Please try again.";
        setError(errorMessage);
        if (onUploadError) onUploadError(errorMessage);
        console.error("Upload error:", err);
      } finally {
        setIsUploading(false);
      }
    },
    [validateFiles, onUploadSuccess, onUploadError],
  );

  return {
    isUploading,
    error,
    uploadFiles,
    validateFiles,
  };
}

"use client";

import { useCallback } from "react";
import Image from "next/image";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVercelBlobValidation } from "@/lib/hooks/use-env-validation";
import { useImageUpload } from "@/lib/hooks/use-image-upload";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
  className?: string;
  endpoint?: "upload" | "upload-multiple";
  folder?: string;
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = 5,
  className,
  endpoint = "upload",
  folder = "uploads",
}: ImageUploadProps) {
  // Validate that the Vercel Blob token is set
  const { isValid, missingVars } = useVercelBlobValidation();

  // Use our custom hook for image upload functionality
  const { isUploading, error, uploadImages } = useImageUpload({
    maxFiles: maxFiles - value.length,
    folder,
    endpoint,
    onUploadSuccess: (urls) => {
      // Add the new URLs to the existing ones
      onChange([...value, ...urls]);
    },
  });

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isValid) {
        console.error("Missing environment variables:", missingVars);
        alert(
          "Image upload is not available. Please check that VERCEL_BLOB_TOKEN or NEXT_PUBLIC_VERCEL_BLOB_TOKEN is set in your .env file",
        );
        return;
      }

      await uploadImages(e.target.files);
      // Reset the file input
      e.target.value = "";
    },
    [isValid, missingVars, uploadImages],
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    },
    [value, onChange],
  );

  return (
    <div className={className}>
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-lg border"
          >
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover transition-all"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Upload Button */}
        {value.length < maxFiles && (
          <div className="relative aspect-square">
            <label
              htmlFor="image-upload"
              className={cn(
                "bg-muted/20 hover:bg-muted/30 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed transition",
                isUploading && "pointer-events-none opacity-60",
              )}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-1">
                  <Loader2 className="text-primary h-6 w-6 animate-spin" />
                  <span className="text-xs">Uploading...</span>
                </div>
              ) : (
                <>
                  <Plus className="text-muted-foreground h-6 w-6" />
                  <span className="text-muted-foreground mt-2 text-xs">
                    Add Image
                  </span>
                </>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple={endpoint === "upload-multiple"}
                onChange={handleUpload}
                disabled={isUploading}
                className="sr-only"
              />
            </label>
          </div>
        )}
      </div>

      {error && <p className="text-destructive mt-2 text-sm">{error}</p>}

      <p className="text-muted-foreground text-xs">
        You can upload up to {maxFiles} images. {value.length} of {maxFiles}{" "}
        uploaded.
      </p>
    </div>
  );
}

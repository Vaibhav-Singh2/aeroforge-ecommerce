"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Trash2, Upload, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VariantImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export function VariantImageUpload({
  value,
  onChange,
  className,
}: VariantImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "product-variants");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload image");
        }

        onChange(data.url);
      } catch (err: any) {
        console.error("Error uploading image:", err);
        setError(err.message || "Error uploading image. Please try again.");
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    [onChange],
  );

  const handleRemove = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <div className={className}>
      <div className="mb-2">
        {value ? (
          <div className="group relative aspect-square h-36 w-36 overflow-hidden rounded-md border">
            <Image
              src={value}
              alt="Variant image"
              fill
              className="object-cover"
              sizes="144px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="variant-image-upload"
            className="bg-muted/20 hover:bg-muted/30 flex h-36 w-36 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed transition"
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-1">
                <Loader2 className="text-primary h-6 w-6 animate-spin" />
                <span className="text-xs">Uploading...</span>
              </div>
            ) : (
              <>
                <ImageIcon className="text-muted-foreground mb-2 h-8 w-8" />
                <span className="text-muted-foreground text-sm">
                  Upload Image
                </span>
              </>
            )}
            <input
              id="variant-image-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
              className="sr-only"
            />
          </label>
        )}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

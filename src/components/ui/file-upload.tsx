"use client";

import { useCallback } from "react";
import { Trash2, Loader2, Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/lib/hooks/use-file-upload";

interface FileUploadProps {
  value: { name: string; url: string }[];
  onChange: (value: { name: string; url: string }[]) => void;
  maxFiles?: number;
  className?: string;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
}

export function FileUpload({
  value,
  onChange,
  maxFiles = 5,
  className,
  acceptedFileTypes = ".stl,.obj",
  maxSizeInMB = 50,
}: FileUploadProps) {
  // Parse the acceptedFileTypes string into an array
  const fileTypes = acceptedFileTypes.split(",").map((type) => type.trim());

  const { isUploading, error, uploadFiles } = useFileUpload({
    maxFiles: maxFiles - value.length,
    maxSizeInMB,
    allowedTypes: fileTypes,
    onUploadSuccess: (newFiles) => {
      onChange([...value, ...newFiles]);
    },
  });

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      await uploadFiles(e.target.files);
      // Reset the file input
      e.target.value = "";
    },
    [uploadFiles],
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newValue = [...value];
      // Revoke the object URL to avoid memory leaks
      if (newValue[index].url.startsWith("blob:")) {
        URL.revokeObjectURL(newValue[index].url);
      }
      newValue.splice(index, 1);
      onChange(newValue);
    },
    [value, onChange],
  );

  return (
    <div className={className}>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {value.map((file, index) => (
          <div
            key={index}
            className="group flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center space-x-3">
              <File className="text-muted-foreground h-8 w-8" />
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium">{file.name}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
            >
              <Trash2 className="text-muted-foreground hover:text-destructive h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Upload Button */}
        {value.length < maxFiles && (
          <div className="relative">
            <label
              htmlFor="file-upload"
              className={cn(
                "bg-muted/20 hover:bg-muted/30 flex h-16 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed transition",
                isUploading && "pointer-events-none opacity-60",
              )}
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="text-primary h-5 w-5 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Upload className="text-muted-foreground h-5 w-5" />
                  <span className="text-muted-foreground text-sm">
                    Upload 3D Model File
                  </span>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                accept={acceptedFileTypes}
                multiple
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
        You can upload up to {maxFiles} files. {value.length} of {maxFiles}{" "}
        uploaded. Maximum size: {maxSizeInMB}MB per file.
      </p>
    </div>
  );
}

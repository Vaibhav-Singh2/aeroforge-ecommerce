"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash2, GripVertical, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ProductImageGallery({
  images,
  onChange,
  maxImages = 10,
  className,
}: ProductImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);
      setError(null);

      try {
        // Don't upload more than maxImages
        const filesToUpload = Array.from(files).slice(
          0,
          maxImages - images.length,
        );

        const formData = new FormData();

        // Add all files for bulk upload
        filesToUpload.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("folder", "products");

        const response = await fetch("/api/upload-multiple", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload files");
        }

        // Add the new URLs to the existing ones
        onChange([...images, ...data.urls]);
      } catch (err: any) {
        console.error("Error uploading files:", err);
        setError(err.message || "Error uploading files. Please try again.");
      } finally {
        setIsUploading(false);
        // Reset the file input
        e.target.value = "";
      }
    },
    [images, onChange, maxImages],
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newImages = [...images];
      newImages.splice(index, 1);
      onChange(newImages);
    },
    [images, onChange],
  );

  const handleDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;

      const items = Array.from(images);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      onChange(items);
    },
    [images, onChange],
  );

  return (
    <div className={className}>
      <div className="mb-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="product-images" direction="horizontal">
            {(provided) => (
              <div
                className="flex flex-wrap gap-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {images.map((url, index) => (
                  <Draggable key={url} draggableId={url} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="group relative aspect-square w-24 overflow-hidden rounded-md border"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="absolute top-1 right-1 z-10 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>

                        <Image
                          src={url}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Upload Button */}
        {images.length < maxImages && (
          <div className="mt-4">
            <label
              htmlFor="product-image-upload"
              className={cn(
                "bg-muted/20 hover:bg-muted/30 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed transition",
                isUploading && "pointer-events-none opacity-60",
              )}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-1">
                  <Loader2 className="text-primary h-5 w-5 animate-spin" />
                  <span className="text-xs">Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload className="text-muted-foreground mb-1 h-5 w-5" />
                  <span className="text-muted-foreground text-xs">
                    Add Image
                  </span>
                </>
              )}
              <input
                id="product-image-upload"
                type="file"
                accept="image/*"
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
        {images.length} of {maxImages} images uploaded.
        {images.length > 0 && " Drag to reorder."}
      </p>
    </div>
  );
}

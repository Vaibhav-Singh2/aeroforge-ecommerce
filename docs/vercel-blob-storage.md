# Using Vercel Blob Storage for Images

This project uses Vercel Blob Storage for handling image uploads and storage. This document provides an overview of how image storage works in the application.

## Environment Setup

Before using image upload features, make sure you have one of the following environment variables set in your `.env` file:

```
VERCEL_BLOB_TOKEN=your_vercel_blob_token
```

or

```
NEXT_PUBLIC_VERCEL_BLOB_TOKEN=your_vercel_blob_token
```

You can get a Vercel Blob token by:

1. Going to your Vercel dashboard
2. Selecting your project
3. Going to Storage -> Blob
4. Creating a new token

## Components & Utilities

### Components

- `ImageUpload`: A reusable component for handling multiple image uploads
- `VariantImageUpload`: A component for handling single image uploads for product variants
- `ProductImageGallery`: A component for handling product images with drag and drop functionality

### Hooks

- `useImageUpload`: A custom React hook for handling image uploads
- `useVercelBlobValidation`: A hook to validate that Vercel Blob tokens are properly set

### Utility Functions

- `uploadToBlob`: Uploads a single file to Vercel Blob storage
- `uploadMultipleToBlob`: Uploads multiple files to Vercel Blob storage
- `deleteFromBlob`: Deletes a file from Vercel Blob storage
- `listBlobFiles`: Lists files in a Vercel Blob storage folder
- `ImageHandler`: A utility class for handling common image operations

## API Routes

The following API routes are available for working with images:

- `/api/upload`: Upload a single image to Vercel Blob
- `/api/upload-multiple`: Upload multiple images to Vercel Blob
- `/api/products/delete-image`: Delete an image from a product

## Usage Examples

### Basic Image Upload

```tsx
import { ImageUpload } from "@/components/ui/image-upload";

export default function MyForm() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <ImageUpload
      value={images}
      onChange={setImages}
      maxFiles={5}
      folder="my-uploads"
    />
  );
}
```

### Product Image Gallery

```tsx
import { ProductImageGallery } from "@/components/ui/product-image-gallery";

export default function ProductForm() {
  const [images, setImages] = useState<string[]>([]);

  return <ProductImageGallery images={images} onChange={setImages} />;
}
```

### Using the useImageUpload Hook

```tsx
import { useImageUpload } from "@/lib/hooks/use-image-upload";

export default function CustomUploader() {
  const [images, setImages] = useState<string[]>([]);

  const { isUploading, error, uploadImages } = useImageUpload({
    folder: "custom-uploads",
    onUploadSuccess: (urls) => {
      setImages((prev) => [...prev, ...urls]);
    },
  });

  const handleFileChange = async (e) => {
    const urls = await uploadImages(e.target.files);
    console.log("Uploaded URLs:", urls);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      {isUploading && <p>Uploading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## Best Practices

1. Use the `folder` parameter to organize your uploads by context (e.g., "products", "user-avatars")
2. Always handle errors from image uploads gracefully
3. Provide visual feedback during uploads
4. Set appropriate maximums for file size and count
5. Use the provided hooks and components rather than implementing your own upload logic

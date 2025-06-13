"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin/admin-provider";
import { Loader2, Save, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Import only the components we're using
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Category {
  id: string;
  name: string;
  type: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  sku: string;
  status: string;
  quantity: number;
  trackQuantity: boolean;
  isFeature: boolean;
  isBestseller: boolean;
  weight: number;
  tags: string[];
  images: string[];
}

interface EditProductFormProps {
  productId: string;
}

export default function EditProductForm({ productId }: EditProductFormProps) {
  const { admin, isLoading } = useAdmin();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    sku: "",
    status: "ACTIVE",
    quantity: "0",
    trackQuantity: true,
    isFeature: false,
    isBestseller: false,
    weight: "0",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !admin) {
      router.push("/admin/login");
    }
  }, [admin, isLoading, router]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoadingProduct(true);
        const response = await fetch(`/api/admin/products/${productId}`);
        const data = await response.json();

        if (data.success && data.product) {
          const product: Product = data.product;

          // Update form data
          setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            categoryId: product.categoryId,
            sku: product.sku,
            status: product.status,
            quantity: product.quantity.toString(),
            trackQuantity: product.trackQuantity,
            isFeature: product.isFeature,
            isBestseller: product.isBestseller,
            weight: (product.weight || 0).toString(),
          });

          // Set tags
          setTags(product.tags || []);

          // Set existing images
          setExistingImages(product.images || []);
        } else {
          setError("Failed to fetch product data.");
          console.error("Failed to fetch product:", data.error);
        }
      } catch (error) {
        setError("An error occurred while loading product data.");
        console.error("Error fetching product:", error);
      } finally {
        setIsLoadingProduct(false);
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        const data = await response.json();

        if (data.success) {
          setCategories(data.categories || []);
        } else {
          console.error("Failed to fetch categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (admin) {
      fetchProduct();
      fetchCategories();
    }
  }, [admin, productId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...newFiles]);

    // Create preview URLs
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    // Remove from preview and selected images
    const newSelectedImages = [...selectedImages];
    const newPreviewUrls = [...imagePreviewUrls];

    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);

    // Remove item at index
    newSelectedImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setSelectedImages(newSelectedImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const removeExistingImage = async (url: string) => {
    try {
      const response = await fetch("/api/admin/products/images", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          imageUrl: url,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setExistingImages(existingImages.filter((img) => img !== url));
      } else {
        console.error("Failed to remove image:", data.error);
        setError("Failed to remove image.");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      setError("An error occurred while removing the image.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // First, update the product data
      const productData = {
        id: productId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        sku: formData.sku,
        status: formData.status,
        quantity: parseInt(formData.quantity),
        trackQuantity: formData.trackQuantity,
        isFeature: formData.isFeature,
        isBestseller: formData.isBestseller,
        weight: parseFloat(formData.weight) || 0,
        tags: tags,
      };

      const productResponse = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const productResult = await productResponse.json();

      if (!productResult.success) {
        throw new Error(productResult.error || "Failed to update product");
      }

      // Then handle image uploads if there are any
      if (selectedImages.length > 0) {
        const formData = new FormData();
        formData.append("productId", productId);
        selectedImages.forEach((image) => {
          formData.append("images", image);
        });

        const imageResponse = await fetch(
          "/api/admin/products/upload-multiple",
          {
            method: "POST",
            body: formData,
          },
        );

        const imageResult = await imageResponse.json();

        if (!imageResult.success) {
          throw new Error(imageResult.error || "Failed to upload images");
        }
      }

      // Success - redirect back to products list
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading || isLoadingProduct) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="mt-4 text-lg">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Edit Product
          </h1>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => {
            // Implement delete functionality
            if (confirm("Are you sure you want to delete this product?")) {
              // Delete the product
            }
          }}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-medium">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing and Inventory */}
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-medium">Pricing and Inventory</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="trackQuantity">Track Inventory</Label>
                <Switch
                  id="trackQuantity"
                  checked={formData.trackQuantity}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("trackQuantity", checked)
                  }
                />
              </div>
            </div>

            {formData.trackQuantity && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity in Stock</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Product Options */}
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-medium">Additional Options</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeature">Featured Product</Label>
                <Switch
                  id="isFeature"
                  checked={formData.isFeature}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isFeature", checked)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isBestseller">Bestseller</Label>
                <Switch
                  id="isBestseller"
                  checked={formData.isBestseller}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isBestseller", checked)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-muted ml-1 rounded-full p-1 text-xs leading-none"
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                id="tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={addTag}
                placeholder="Enter tags and press Enter"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-medium">Product Images</h2>
          <div className="space-y-4">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <Label className="mb-2 block">Current Images</Label>
                <div className="flex flex-wrap gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative h-24 w-24">
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="h-24 w-24 rounded-lg object-cover shadow-sm"
                        width={96}
                        height={96}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image)}
                        className="absolute top-0 right-0 rounded-full bg-red-500 p-1 text-white shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <Label htmlFor="images" className="mb-2 block">
                Add New Images
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
                className="cursor-pointer"
              />
            </div>

            {/* Image Preview */}
            {imagePreviewUrls.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">New Images Preview</p>
                <div className="flex flex-wrap gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative h-24 w-24">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 rounded-lg object-cover shadow-sm"
                        width={96}
                        height={96}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 rounded-full bg-red-500 p-1 text-white shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

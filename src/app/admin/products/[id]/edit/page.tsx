"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin/admin-provider";
import { Loader2, Save, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

import AdminHeader from "@/components/admin/admin-header";
import AdminSidebar from "@/components/admin/admin-sidebar";
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
import Image from "next/image";

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

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { admin, isLoading } = useAdmin();
  const router = useRouter();
  const { id } = params;

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
        const response = await fetch(`/api/admin/products/${id}`);
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
  }, [admin, id]);

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
          productId: id,
          imageUrl: url,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove from existing images
        setExistingImages(existingImages.filter((img) => img !== url));
      } else {
        alert(`Failed to delete image: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("An error occurred while deleting the image");
    }
  };

  const handleTagAdd = () => {
    if (!tagInput.trim()) return;

    // Add tag if not already in list
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }

    // Clear input
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Create a FormData object to send both text fields and files
      const productFormData = new FormData();

      // Add text fields
      productFormData.append("name", formData.name);
      productFormData.append("description", formData.description);
      productFormData.append("price", formData.price);
      productFormData.append("categoryId", formData.categoryId);
      productFormData.append("sku", formData.sku);
      productFormData.append("status", formData.status);
      productFormData.append("quantity", formData.quantity);
      productFormData.append(
        "trackQuantity",
        formData.trackQuantity.toString(),
      );
      productFormData.append("isFeature", formData.isFeature.toString());
      productFormData.append("isBestseller", formData.isBestseller.toString());
      productFormData.append("weight", formData.weight);

      // Add tags as JSON
      productFormData.append("tags", JSON.stringify(tags));

      // Add existing images as JSON
      productFormData.append("existingImages", JSON.stringify(existingImages));

      // Add new image files
      selectedImages.forEach((file, index) => {
        productFormData.append(`newImages[${index}]`, file);
      });

      // Submit the form data
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: productFormData,
      });

      const data = await response.json();

      if (data.success) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        alert(`Failed to update product: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isLoadingProduct) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" asChild>
          <Link href="/admin/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader title="Edit Product" />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link href="/admin/products">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Edit Product</h1>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Product
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Main product information */}
            <div className="col-span-2 space-y-6">
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">
                  Product Information
                </h2>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description*</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="categoryId">Category*</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        handleSelectChange("categoryId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name} ({category.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price (₹)*</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="sku">SKU*</Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="Product SKU"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">Product Images</h2>

                <div className="space-y-4">
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <>
                      <h3 className="text-muted-foreground text-sm font-medium">
                        Current Images
                      </h3>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {existingImages.map((url, index) => (
                          <div
                            key={`existing-${index}`}
                            className="group relative aspect-square overflow-hidden rounded-md border"
                          >
                            <Image
                              src={url}
                              alt={`Product image ${index + 1}`}
                              className="h-full w-full object-cover"
                              width={300}
                              height={300}
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(url)}
                              className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Upload New Images */}
                  <div className="grid gap-2">
                    <Label htmlFor="images">Upload New Images</Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* New Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <>
                      <h3 className="text-muted-foreground text-sm font-medium">
                        New Images
                      </h3>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {imagePreviewUrls.map((url, index) => (
                          <div
                            key={`new-${index}`}
                            className="group relative aspect-square overflow-hidden rounded-md border"
                          >
                            <Image
                              src={url}
                              alt={`New image ${index + 1}`}
                              className="h-full w-full object-cover"
                              width={300}
                              height={300}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">Tags</h2>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleTagAdd();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleTagAdd}>
                      Add
                    </Button>
                  </div>

                  {tags.length > 0 && (
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
                            className="text-muted-foreground hover:text-foreground ml-1 rounded-full"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6L6 18"></path>
                              <path d="M6 6l12 12"></path>
                            </svg>
                            <span className="sr-only">Remove tag</span>
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar options */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">Product Status</h2>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">
                          Out of Stock
                        </SelectItem>
                        <SelectItem value="DISCONTINUED">
                          Discontinued
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
              </div>

              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">Inventory</h2>

                <div className="space-y-4">
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

                  {formData.trackQuantity && (
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="0"
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="weight">Weight (grams)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

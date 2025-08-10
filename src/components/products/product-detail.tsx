"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, ProductVariant, Category, Review } from "@prisma/client";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import {
  ChevronRight,
  Star,
  Share2,
  Truck,
  Clock,
  ShieldCheck,
  Check,
  Minus,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extended types for the product with its relations
type ProductWithRelations = Product & {
  category: Category | null;
  variants: ProductVariant[];
  reviews: (Review & {
    user: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  })[];
};

interface ProductDetailProps {
  product: ProductWithRelations;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [mainImage, setMainImage] = useState(
    product.images && product.images.length > 0 ? product.images[0] : "",
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null,
  );
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, Math.min(10, value)));
  };

  // Calculate average rating
  const avgRating = product.reviews.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length
    : 0;

  // Ensure product.category has a slug, not id, without using 'any'
  let categoryWithSlug: { name: string; slug: string } | undefined = undefined;
  if (product.category) {
    if (
      "slug" in product.category &&
      typeof product.category.slug === "string"
    ) {
      categoryWithSlug = {
        name: product.category.name,
        slug: product.category.slug,
      };
    } else if (
      "id" in product.category &&
      typeof (product.category as { id?: string }).id === "string"
    ) {
      categoryWithSlug = {
        name: product.category.name,
        slug: (product.category as { id: string }).id,
      };
    }
  }
  const productWithSlug = { ...product, category: categoryWithSlug };

  return (
    <div className="container px-5 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="text-muted-foreground mx-2 h-4 w-4" />
        {product.category && (
          <>
            <Link
              href={`/category/${product.category.slug}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="text-muted-foreground mx-2 h-4 w-4" />
          </>
        )}
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <AspectRatio
            ratio={1 / 1}
            className="bg-muted overflow-hidden rounded-lg border"
          >
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-muted-foreground">
                  No image available
                </span>
              </div>
            )}
          </AspectRatio>

          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(image)}
                  className={`overflow-hidden rounded-md border ${
                    image === mainImage ? "ring-primary ring-2" : ""
                  }`}
                >
                  <AspectRatio ratio={1 / 1}>
                    <Image
                      src={image}
                      alt={`Product image ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-muted-foreground ml-2 text-sm">
                  ({product.reviews.length}{" "}
                  {product.reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
              {product.sku && (
                <span className="text-muted-foreground text-sm">
                  SKU: {product.sku}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              ₹{product.price.toFixed(2)}
            </span>
            {/* You can add discount logic here */}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Options</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`rounded-md border px-4 py-2 text-sm ${
                      selectedVariant?.id === variant.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-4">
            <h3 className="font-medium">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <AddToCartButton
              product={productWithSlug}
              quantity={quantity}
              variantId={selectedVariant?.id}
              size="default"
              className="flex-1 gap-2 sm:min-w-[200px] sm:flex-none"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                const shareUrl =
                  typeof window !== "undefined" ? window.location.href : "";
                const shareData = {
                  title: product.name,
                  text:
                    product.description?.slice(0, 100) ||
                    "Check out this product!",
                  url: shareUrl,
                };
                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch (err) {
                    console.error("Error sharing:", err);
                    alert("Failed to share product");
                  }
                } else if (navigator.clipboard) {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    // Optionally show a toast/alert
                    alert("Link copied to clipboard!");
                  } catch (err) {
                    console.error("Error copying link:", err);
                    alert("Failed to copy link");
                  }
                } else {
                  alert("Sharing not supported on this device.");
                }
              }}
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          {/* Shipping & Returns */}
          <div className="bg-muted/50 space-y-4 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Truck className="text-muted-foreground h-5 w-5" />
              <div>
                <h4 className="font-medium">Free shipping</h4>
                <p className="text-muted-foreground text-sm">
                  For orders over ₹999
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-muted-foreground h-5 w-5" />
              <div>
                <h4 className="font-medium">Fast delivery</h4>
                <p className="text-muted-foreground text-sm">
                  2-5 business days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-muted-foreground h-5 w-5" />
              <div>
                <h4 className="font-medium">30-day returns</h4>
                <p className="text-muted-foreground text-sm">
                  Hassle-free returns
                </p>
              </div>
            </div>
          </div>

          {/* Additional features - can be added based on product type */}
          {product.specifications && (
            <div className="space-y-2">
              <h3 className="font-medium">Key Specifications</h3>
              <ul className="space-y-1">
                {" "}
                {Object.entries(
                  product.specifications as Record<
                    string,
                    string | number | boolean
                  >,
                ).map(([key, value]) => (
                  <li key={key} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{key}:</span>{" "}
                    {value.toString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviews.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="prose prose-slate max-w-none">
              {product.description.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <div className="space-y-6">
              {product.specifications ? (
                <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
                  {" "}
                  {Object.entries(
                    product.specifications as Record<
                      string,
                      string | number | boolean
                    >,
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b pb-2"
                    >
                      <span className="font-medium">{key}</span>
                      <span>{value.toString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No specifications available.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            <div className="space-y-8">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {review.user?.imageUrl ? (
                          <Image
                            src={review.user.imageUrl}
                            alt={review.user.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                            {review.user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{review.user.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && (
                      <h4 className="font-medium">{review.title}</h4>
                    )}
                    <p className="text-muted-foreground">{review.comment}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                        {review.images.map((image, i) => (
                          <Image
                            key={i}
                            src={image}
                            alt={`Review image ${i + 1}`}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                        ))}
                      </div>
                    )}
                    <Separator className="mt-4" />
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No reviews yet.</p>
                  <Button variant="outline" className="mt-4">
                    Write a Review
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

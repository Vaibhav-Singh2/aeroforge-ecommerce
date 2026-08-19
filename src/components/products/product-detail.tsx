"use client";

import { useState, useEffect, useMemo } from "react";
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
import { ProductReviewsSection } from "@/components/products/product-reviews-section";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { toast } from "sonner";

// Extended types for the product with its relations

type ProductWithRelations = Product & {
  category: Category | null;
  variants: ProductVariant[];
  reviews: ReviewWithUser[];
};
interface ProductDetailProps {
  product: ProductWithRelations;
  initialVariantId?: string;
}

type ReviewWithUser = Review & {
  user: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

export function ProductDetail({
  product,
  initialVariantId,
}: ProductDetailProps) {
  // Determine initial variant based on prop if provided
  const initialVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    if (initialVariantId) {
      const match = product.variants.find(
        (v) => v.id === initialVariantId || v.sku === initialVariantId,
      );
      if (match) return match;
    }
    return product.variants[0];
  }, [product.variants, initialVariantId]);

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(initialVariant);

  const [mainImage, setMainImage] = useState(
    selectedVariant?.image ||
      (product.images && product.images.length > 0 ? product.images[0] : ""),
  );
  const [quantity, setQuantity] = useState(1);

  // Sync if initialVariant changes
  useEffect(() => {
    if (initialVariant) {
      setSelectedVariant(initialVariant);
      if (initialVariant.image) {
        setMainImage(initialVariant.image);
      }
    }
  }, [initialVariant]);

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (variant.image) {
      setMainImage(variant.image);
    }
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("variant", variant.id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, Math.min(10, value)));
  };

  // Calculate average rating
  const avgRating = product.reviews.length
    ? product.reviews.reduce(
        (sum: number, review: Review) => sum + review.rating,
        0,
      ) / product.reviews.length
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

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentSku = selectedVariant?.sku || product.sku;
  const currentStock = selectedVariant?.quantity ?? product.quantity;

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
        <span aria-current="page" className="truncate">{product.name}</span>
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
                className="object-cover transition-all duration-300"
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
              {product.images.map((image: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setMainImage(image)}
                  className={`overflow-hidden rounded-md border transition-all ${
                    image === mainImage ? "ring-primary ring-2 shadow-xs" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <AspectRatio ratio={1 / 1}>
                    <Image
                      src={image}
                      alt={`Product image ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 20vw, 96px"
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{product.name}</h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="ml-1.5 font-semibold text-foreground">
                  ({product.reviews.length}{" "}
                  {product.reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>

              {currentSku && (
                <span className="font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border">
                  SKU: <strong className="text-foreground">{currentSku}</strong>
                </span>
              )}

              {currentStock > 0 ? (
                <span className="font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                  ● In Stock ({currentStock} available)
                </span>
              ) : (
                <span className="font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20">
                  ● Out of Stock
                </span>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-foreground">
              ₹{currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            {selectedVariant && selectedVariant.price && selectedVariant.price !== product.price && (
              <span className="text-xs text-muted-foreground">
                (Base price: ₹{product.price.toFixed(2)})
              </span>
            )}
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 rounded-lg border bg-muted/20 p-3.5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                  Option: <span className="text-primary font-bold">{selectedVariant?.name || "Default"}</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: ProductVariant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleSelectVariant(variant)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs ring-2 ring-primary/30 font-semibold"
                          : "bg-background hover:bg-muted text-foreground border-input"
                      }`}
                    >
                      <span>{variant.name}</span>
                      {variant.price && variant.price !== product.price && (
                        <span
                          className={`text-[11px] ${
                            isSelected
                              ? "text-primary-foreground/90 font-bold"
                              : "text-muted-foreground"
                          }`}
                        >
                          (₹{variant.price.toLocaleString("en-IN")})
                        </span>
                      )}
                    </button>
                  );
                })}
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
          <div className="flex flex-col sm:flex-row gap-3">
            <AddToCartButton
              product={productWithSlug}
              quantity={quantity}
              variantId={selectedVariant?.id}
              size="default"
              className="flex-1 gap-2 h-11 text-sm font-semibold"
            />
            <div className="flex items-center gap-2">
              <WishlistButton product={productWithSlug} variant="full" className="h-11 flex-1 sm:flex-none text-xs" />
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0"
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
                      console.warn("Share cancelled:", err);
                    }
                  } else if (navigator.clipboard) {
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      toast.success("Product link copied to clipboard!");
                    } catch (err) {
                      console.error("Error copying link:", err);
                      toast.error("Failed to copy link");
                    }
                  }
                }}
                aria-label="Share"
                title="Share product link"
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
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
              {product.description
                .split("\n")
                .map((paragraph: string, i: number) => (
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
          <TabsContent value="reviews" className="py-2">
            <ProductReviewsSection
              productId={product.id}
              productSlug={product.slug}
              productName={product.name}
              reviews={product.reviews || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

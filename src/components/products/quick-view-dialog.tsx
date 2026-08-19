"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Star, Plus, Minus, ArrowRight, Check, X, ShieldCheck } from "lucide-react";
import { Product, ProductVariant } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

interface QuickViewDialogProps {
  product: Product & {
    category?: { name: string; slug: string } | null;
    variants?: ProductVariant[];
  };
  trigger?: React.ReactNode;
}

export function QuickViewDialog({ product, trigger }: QuickViewDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null,
  );
  const [mainImage, setMainImage] = useState(
    selectedVariant?.image || (product.images && product.images[0]) || "",
  );
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentSku = selectedVariant?.sku || product.sku;
  const currentStock = selectedVariant?.quantity ?? product.quantity;

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (variant.image) {
      setMainImage(variant.image);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-md backdrop-blur-md bg-background/80 hover:bg-background transition-all"
            title="Quick View"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Quick View</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl overflow-hidden p-0 border shadow-2xl bg-background/95 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Gallery */}
          <div className="p-6 bg-muted/20 flex flex-col justify-center space-y-3 border-b md:border-b-0 md:border-r">
            <AspectRatio ratio={1 / 1} className="relative overflow-hidden rounded-lg border bg-muted">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover transition-all duration-300"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No image available
                </div>
              )}
            </AspectRatio>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-md border transition-all ${
                      img === mainImage ? "ring-2 ring-primary shadow-xs" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Form */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {product.category && (
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {product.category.name}
                </span>
              )}

              <DialogHeader className="p-0 text-left">
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground line-clamp-2 pt-1">
                  {product.description}
                </DialogDescription>
              </DialogHeader>

              {/* Price & SKU & Stock */}
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-extrabold text-foreground">
                  ₹{currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                <div className="flex items-center gap-2">
                  {currentSku && (
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border">
                      {currentSku}
                    </span>
                  )}
                  {currentStock > 0 ? (
                    <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Variant Switcher */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-foreground block">
                    Option: <span className="text-primary">{selectedVariant?.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleVariantSelect(v)}
                          className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary font-semibold ring-1 ring-primary/40 shadow-xs"
                              : "bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          <span>{v.name}</span>
                          {v.price && v.price !== product.price && (
                            <span className="text-[10px] ml-1 opacity-80">
                              (₹{v.price.toLocaleString("en-IN")})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-medium text-foreground">Quantity:</span>
                <div className="flex items-center gap-1.5 rounded-md border bg-muted/30 px-1 py-0.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-40"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-6 text-center text-xs font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t">
              <AddToCartButton
                product={product}
                variantId={selectedVariant?.id}
                quantity={quantity}
                className="w-full justify-center text-xs font-semibold"
              />

              <Button
                variant="ghost"
                className="w-full justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={`/product/${product.slug}${selectedVariant ? `?variant=${selectedVariant.id}` : ""}`}>
                  <span>View Full Product Specifications</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

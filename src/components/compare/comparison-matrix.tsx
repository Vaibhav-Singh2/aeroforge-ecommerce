"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Scale, Trash2, ShoppingBag, Plus, Check, ArrowRight, Sparkles, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  removeFromCompare,
  clearCompare,
  addToCompare,
  type CompareProduct,
} from "@/lib/redux/features/compareSlice";
import { addCartItem, openCart } from "@/lib/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface ComparisonMatrixProps {
  catalogProducts: CompareProduct[];
}

export function ComparisonMatrix({ catalogProducts }: ComparisonMatrixProps) {
  const dispatch = useAppDispatch();
  const selectedProducts = useAppSelector((state) => state.compare.items);
  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  // If redux comparison is empty, populate with 2 default drones for an instant rich experience!
  const displayProducts =
    selectedProducts.length > 0
      ? selectedProducts
      : catalogProducts.slice(0, 3);

  // Collect all unique specification keys across display products
  const allSpecKeys = Array.from(
    new Set(
      displayProducts.flatMap((p) =>
        p.specifications ? Object.keys(p.specifications) : [],
      ),
    ),
  );

  const handleAddToCart = (p: CompareProduct) => {
    dispatch(
      addCartItem({
        id: `cart-${p.id}`,
        productId: p.id,
        quantity: 1,
        product: {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          description: p.description || "",
          sku: p.sku || "",
          images: p.image ? [p.image] : [],
          tags: [],
          isFeature: false,
          isBestseller: false,
          trackQuantity: true,
          quantity: 10,
          weight: null,
          status: "ACTIVE" as any,
          categoryId: "",
          specifications: p.specifications || null,
          compatibleParts: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      }),
    );
    dispatch(openCart());
  };

  return (
    <div className="container max-w-7xl py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Scale className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Aircraft & Hardware Comparison
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5">
            Compare aerodynamics, avionics, motor specs, and pricing side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-muted/40 px-3 py-1.5 rounded-lg border">
            <Switch
              checked={highlightDiffs}
              onCheckedChange={setHighlightDiffs}
              id="diff-switch"
            />
            <label htmlFor="diff-switch" className="cursor-pointer">
              Highlight Differences
            </label>
          </div>

          {selectedProducts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(clearCompare())}
              className="text-xs text-muted-foreground hover:text-destructive gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto rounded-2xl border bg-card/60 shadow-xl backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="p-5 font-bold text-xs uppercase tracking-wider text-muted-foreground w-48 min-w-44 sticky left-0 bg-background/95 backdrop-blur-md z-10">
                Specification Metric
              </th>
              {displayProducts.map((p) => (
                <th key={p.id} className="p-5 min-w-[260px] max-w-[320px] align-top">
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="relative h-44 w-full overflow-hidden rounded-xl border bg-muted group">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                      {selectedProducts.some((item) => item.id === p.id) && (
                        <button
                          onClick={() => dispatch(removeFromCompare(p.id))}
                          className="absolute top-2 right-2 rounded-full bg-background/80 p-1.5 text-muted-foreground hover:text-destructive backdrop-blur-md transition-all shadow-xs"
                          title="Remove from comparison"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Title & Price */}
                    <div>
                      {p.category && (
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                          {p.category}
                        </span>
                      )}
                      <Link
                        href={`/product/${p.slug}`}
                        className="text-sm font-bold text-foreground line-clamp-2 hover:underline pt-0.5 block"
                      >
                        {p.name}
                      </Link>
                    </div>

                    <div className="text-xl font-extrabold text-foreground font-mono">
                      ₹{p.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>

                    {/* Action Button */}
                    <Button
                      size="sm"
                      className="w-full gap-2 text-xs font-semibold"
                      onClick={() => handleAddToCart(p)}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Add to Cart</span>
                    </Button>
                  </div>
                </th>
              ))}

              {/* Add More Slot */}
              {displayProducts.length < 4 && (
                <th className="p-5 min-w-[220px] align-middle text-center border-l border-dashed">
                  <div className="flex flex-col items-center justify-center space-y-3 p-6 rounded-xl border border-dashed bg-muted/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Add up to 4 models to compare
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectorOpen(!selectorOpen)}
                      className="text-xs"
                    >
                      Select Hardware
                    </Button>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y text-xs">
            {/* SKU Row */}
            <tr className="hover:bg-muted/20">
              <td className="p-4 font-semibold text-muted-foreground sticky left-0 bg-background/95 backdrop-blur-md">
                Model SKU
              </td>
              {displayProducts.map((p) => (
                <td key={p.id} className="p-4 font-mono text-foreground font-medium">
                  {p.sku || "AFL-CUSTOM"}
                </td>
              ))}
            </tr>

            {/* Category Row */}
            <tr className="hover:bg-muted/20">
              <td className="p-4 font-semibold text-muted-foreground sticky left-0 bg-background/95 backdrop-blur-md">
                Platform Category
              </td>
              {displayProducts.map((p) => (
                <td key={p.id} className="p-4 text-foreground font-medium">
                  <Badge variant="secondary" className="text-[11px]">
                    {p.category || "Aerospace Hardware"}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* Dynamic Technical Specs Rows */}
            {allSpecKeys.map((key) => {
              const values = displayProducts.map(
                (p) => p.specifications?.[key] || "—",
              );
              const isDifferent =
                highlightDiffs &&
                new Set(values.map((v) => String(v).toLowerCase())).size > 1;

              return (
                <tr
                  key={key}
                  className={`transition-colors ${
                    isDifferent
                      ? "bg-amber-500/10 dark:bg-amber-500/15"
                      : "hover:bg-muted/20"
                  }`}
                >
                  <td className="p-4 font-semibold text-muted-foreground sticky left-0 bg-background/95 backdrop-blur-md">
                    {key}
                  </td>
                  {displayProducts.map((p) => {
                    const val = p.specifications?.[key];
                    return (
                      <td
                        key={p.id}
                        className={`p-4 font-medium text-foreground ${
                          isDifferent ? "font-semibold text-primary" : ""
                        }`}
                      >
                        {val !== undefined ? String(val) : "—"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Hardware Picker Drawer Modal */}
      {selectorOpen && (
        <div className="rounded-2xl border bg-card p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">
              Select Aircraft or Component to Add to Comparison Matrix
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setSelectorOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
            {catalogProducts.map((p) => {
              const isAlreadyIn = selectedProducts.some((item) => item.id === p.id);
              return (
                <button
                  key={p.id}
                  disabled={isAlreadyIn}
                  onClick={() => {
                    dispatch(addToCompare(p));
                    setSelectorOpen(false);
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                    isAlreadyIn
                      ? "opacity-50 cursor-not-allowed bg-muted/40"
                      : "hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {p.name}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground">
                      ₹{p.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Filter,
  X,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import { Review } from "@prisma/client";
import { WriteReviewDialog } from "@/components/products/write-review-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReviewWithUser = Review & {
  user: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

interface ProductReviewsSectionProps {
  productId: string;
  productSlug: string;
  productName: string;
  reviews: ReviewWithUser[];
}

export function ProductReviewsSection({
  productId,
  productSlug,
  productName,
  reviews,
}: ProductReviewsSectionProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");

  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  // Calculate star counts & percentages
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  // Filtered & Sorted reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (selectedRating !== null) {
      list = list.filter((r) => r.rating === selectedRating);
    }

    if (verifiedOnly) {
      list = list.filter((r) => r.isVerified);
    }

    if (sortBy === "highest") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      list.sort((a, b) => a.rating - b.rating);
    } else {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return list;
  }, [reviews, selectedRating, verifiedOnly, sortBy]);

  const hasActiveFilters = selectedRating !== null || verifiedOnly;

  return (
    <div className="space-y-8 py-4">
      {/* Overview Grid (Amazon/Flipkart Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-xl border bg-card/50 p-6 shadow-xs">
        {/* Left Rating Breakdown */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-foreground">Customer Reviews & Ratings</h3>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-foreground">
                {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
              </span>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Based on {totalReviews} {totalReviews === 1 ? "verified review" : "verified reviews"}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Clickable Progress Bars */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-muted-foreground font-medium block mb-1">
              Click any star rating to filter reviews:
            </span>
            {distribution.map(({ stars, count, percentage }) => {
              const isSelected = selectedRating === stars;
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() =>
                    setSelectedRating(isSelected ? null : stars)
                  }
                  className={`w-full flex items-center gap-3 text-xs p-1.5 rounded-lg transition-all text-left ${
                    isSelected
                      ? "bg-primary/10 ring-1 ring-primary font-semibold"
                      : "hover:bg-muted/60"
                  }`}
                >
                  <span className="w-12 text-foreground font-medium flex items-center gap-1">
                    <span>{stars}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-muted-foreground text-[11px]">
                    {count} ({percentage}%)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Write a Review Action */}
          <div className="pt-3 border-t">
            <h4 className="text-xs font-semibold text-foreground mb-1">Review this product</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Share your flight feedback and build thoughts with fellow pilots.
            </p>
            <WriteReviewDialog
              productId={productId}
              productSlug={productSlug}
              productName={productName}
            />
          </div>
        </div>

        {/* Right Reviews Stream */}
        <div className="lg:col-span-7 space-y-5">
          {/* Filter Bar & Sorter */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-primary" />
                Filter:
              </span>

              {/* All Reviews Pill */}
              <button
                onClick={() => {
                  setSelectedRating(null);
                  setVerifiedOnly(false);
                }}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                  !hasActiveFilters
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({totalReviews})
              </button>

              {/* Star Rating Quick Filter Buttons */}
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => r.rating === stars).length;
                if (count === 0 && selectedRating !== stars) return null;
                const isSelected = selectedRating === stars;
                return (
                  <button
                    key={stars}
                    onClick={() =>
                      setSelectedRating(isSelected ? null : stars)
                    }
                    className={`rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-all ${
                      isSelected
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{stars}★</span>
                    <span className="text-[10px] opacity-80">({count})</span>
                  </button>
                );
              })}

              {/* Verified Purchases Only Toggle */}
              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-all ${
                  verifiedOnly
                    ? "bg-green-600 text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified Only</span>
              </button>

              {/* Clear Filter Button */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSelectedRating(null);
                    setVerifiedOnly(false);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-1"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Select
                value={sortBy}
                onValueChange={(val: "newest" | "highest" | "lowest") =>
                  setSortBy(val)
                }
              >
                <SelectTrigger
                  size="sm"
                  className="h-8 text-xs font-medium bg-background border-input"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="newest" className="text-xs">
                    Most Recent
                  </SelectItem>
                  <SelectItem value="highest" className="text-xs">
                    Highest Rating
                  </SelectItem>
                  <SelectItem value="lowest" className="text-xs">
                    Lowest Rating
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Notice Bar */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5 text-xs text-foreground">
              <span>
                Showing <strong>{filteredReviews.length}</strong> of {totalReviews} reviews
                {selectedRating !== null ? ` with ${selectedRating} stars` : ""}
                {verifiedOnly ? " from verified buyers" : ""}
              </span>
              <button
                onClick={() => {
                  setSelectedRating(null);
                  setVerifiedOnly(false);
                }}
                className="text-primary hover:underline text-[11px] font-semibold"
              >
                Show All
              </button>
            </div>
          )}

          {/* Reviews Stream */}
          {filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed bg-muted/20">
              <p className="text-sm font-semibold text-foreground">
                No matching reviews found
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                There are no reviews matching your currently selected star rating or filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 text-xs"
                onClick={() => {
                  setSelectedRating(null);
                  setVerifiedOnly(false);
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredReviews.map((review) => (
                <div key={review.id} className="py-4 space-y-2 first:pt-0 last:pb-0">
                  {/* Author & Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {review.user?.imageUrl ? (
                        <Image
                          src={review.user.imageUrl}
                          alt={review.user.name}
                          width={32}
                          height={32}
                          unoptimized
                          className="rounded-full object-cover border"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {review.user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {review.user?.name || "AeroForge Pilot"}
                          </span>
                          {review.isVerified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Headline */}
                  {review.title && (
                    <h5 className="text-xs font-bold text-foreground pt-0.5">
                      {review.title}
                    </h5>
                  )}

                  {/* Comment */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Review Photos */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {review.images.map((img, i) => (
                        <div
                          key={i}
                          className="relative h-14 w-14 overflow-hidden rounded-md border bg-muted"
                        >
                          <Image
                            src={img}
                            alt={`Review attachment ${i + 1}`}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

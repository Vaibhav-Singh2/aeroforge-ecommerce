"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Star, MessageSquarePlus, Clock, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createOrUpdateReview } from "@/lib/actions/review-actions";

interface WriteReviewDialogProps {
  productId: string;
  productSlug: string;
  productName: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor — Needs major improvements",
  2: "Fair — Below expectations",
  3: "Good — Meets basic expectations",
  4: "Very Good — High quality and performance",
  5: "Exceptional — Flawless build and flight experience",
};

export function WriteReviewDialog({
  productId,
  productSlug,
  productName,
  onSuccess,
  trigger,
}: WriteReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast.info("Please sign in to submit your product review.");
      openSignIn();
      return;
    }

    if (!comment.trim()) {
      toast.error("Please provide review feedback comments.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOrUpdateReview({
        productId,
        productSlug,
        rating,
        title,
        comment,
      });

      if (res.success) {
        toast.success("Review published successfully!");
        setOpen(false);
        setTitle("");
        setComment("");
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2 text-xs font-semibold shadow-xs">
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            <span>Write a Customer Review</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg border shadow-2xl bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Write a Product Review</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground line-clamp-1">
            Sharing your experience for <strong className="text-foreground">{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Star Selector */}
          <div className="space-y-1.5 rounded-lg border bg-muted/30 p-3">
            <label className="text-xs font-semibold text-foreground block">
              Overall Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-muted-foreground hover:scale-110 transition-transform focus:outline-hidden"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        active
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                {RATING_LABELS[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* Headline Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground block">
              Review Headline (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Crisp throttle response, rock-solid video link!"
              className="w-full rounded-md border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
            />
          </div>

          {/* Detailed Feedback Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground block">
              Written Feedback *
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="What did you like or dislike? How was the flight performance, durability, or ease of setup?"
              className="w-full rounded-md border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden resize-none"
            />
          </div>

          {/* Trust Notice */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/20 p-2.5 rounded-md border">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>
              Verified buyer badges are automatically awarded to accounts with confirmed order history.
            </span>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-2 min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-3.5 w-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Publish Review</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

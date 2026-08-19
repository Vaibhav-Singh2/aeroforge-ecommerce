"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowUpRight } from "lucide-react";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't dismissed in current session
    const dismissed = sessionStorage.getItem("aeroforge_demo_banner_dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("aeroforge_demo_banner_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="bg-muted/60 text-foreground relative z-50 border-b px-4 py-2 text-xs backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium tracking-wide">
            <span className="relative flex h-1.5 w-1.5">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary relative inline-flex h-1.5 w-1.5 rounded-full"></span>
            </span>
            PORTFOLIO SHOWCASE
          </span>

          <span className="text-muted-foreground hidden sm:inline">•</span>

          <p className="text-muted-foreground text-xs leading-none">
            Engineered by{" "}
            <Link
              href="https://github.com/Vaibhav-Singh2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary font-semibold underline-offset-2 transition-colors hover:underline"
            >
              Vaibhav Singh
            </Link>
            . Payments operate in <strong className="text-foreground font-medium">Razorpay Test Mode</strong> (no real charges).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/Vaibhav-Singh2/aeroforge-ecommerce"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary text-muted-foreground hidden items-center gap-1 font-medium transition-colors md:flex"
          >
            <span>View Architecture</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss notice"
            className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

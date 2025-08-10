"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu, Search, X, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MainNav } from "@/components/layouts/main-nav";
import { MobileNav } from "@/components/layouts/mobile-nav";
import { ThemeToggle } from "../themeToggle";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  closeSearch,
  openSearch,
  closeMobileMenu,
  openMobileMenu,
} from "@/lib/redux/features/uiSlice";

export function SiteHeader() {
  const dispatch = useAppDispatch();
  const { isSearchOpen, isMobileMenuOpen } = useAppSelector(
    (state) => state.ui,
  );
  const { items } = useAppSelector((state) => state.cart);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Update scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    if (isMobileMenuOpen) {
      dispatch(closeMobileMenu());
    }
    // ignore missing dependency warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, dispatch]);

  const cartItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full px-5 transition-all duration-200",
        isScrolled
          ? "bg-background/95 border-b shadow-sm backdrop-blur-sm"
          : "bg-transparent",
      )}
    >
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="hidden text-xl font-bold md:inline-block">
              {"Anubhav Projects's Lab"}
            </span>
            <span className="text-xl font-bold md:hidden">{"AP Lab"}</span>
          </Link>
          <MainNav />
        </div>

        <div className="flex items-center gap-2">
          {!isSearchOpen ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(openSearch())}
                className="hover:bg-muted transition-all duration-200"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              <ThemeToggle />

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>

              <UserButton afterSignOutUrl="/" />

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => dispatch(openMobileMenu())}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </>
          ) : (
            <div className="flex w-full items-center md:w-auto">
              <input
                type="search"
                placeholder="Search products..."
                className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-all focus-visible:ring-1 focus-visible:outline-none md:w-[300px]"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(closeSearch())}
                className="ml-1"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileNav onClose={() => dispatch(closeMobileMenu())} />
      )}
    </header>
  );
}

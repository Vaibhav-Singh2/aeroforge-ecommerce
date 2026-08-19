"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { Menu, Search, X, ShoppingCart, User, Heart, Scale } from "lucide-react";

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
import { openCart, type CartItem } from "@/lib/redux/features/cartSlice";
import { openWishlist } from "@/lib/redux/features/wishlistSlice";
import { AeroForgeLogo } from "@/components/ui/logo";

export function SiteHeader() {
  const dispatch = useAppDispatch();
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const { isSearchOpen, isMobileMenuOpen } = useAppSelector(
    (state) => state.ui,
  );
  const { items } = useAppSelector((state) => state.cart);
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
  const compareCount = useAppSelector((state) => state.compare.items.length);
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
    (total: number, item: CartItem) => total + item.quantity,
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
            <AeroForgeLogo />
          </Link>
          <MainNav />
        </div>

        <div className="flex items-center gap-2">
          {!isSearchOpen ? (
            <>
              {/* Desktop Search Bar Trigger */}
              <button
                type="button"
                onClick={() => dispatch(openSearch())}
                className="hover:bg-muted/80 hover:border-primary/40 hidden h-9 w-64 items-center justify-between rounded-lg border bg-muted/40 px-3 text-xs text-muted-foreground transition-all md:flex lg:w-80"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">Search products, services & parts...</span>
                </div>
                <kbd className="bg-background text-muted-foreground border-border/80 ml-2 flex h-5 shrink-0 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-semibold">
                  <span>⌘</span>K
                </kbd>
              </button>

              {/* Mobile Search Icon */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(openSearch())}
                className="hover:bg-muted transition-all duration-200 md:hidden"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              <ThemeToggle />

              {/* Wishlist Trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => dispatch(openWishlist())}
                title="Pilot Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center p-0 text-[10px]"
                  >
                    {wishlistCount}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>

              {/* Compare Matrix Trigger */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative hidden sm:inline-flex"
                title="Compare Matrix"
              >
                <Link href="/compare">
                  <Scale className="h-5 w-5" />
                  {compareCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground"
                    >
                      {compareCount}
                    </Badge>
                  )}
                  <span className="sr-only">Compare Matrix</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => dispatch(openCart())}
              >
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

              <div className="flex h-9 w-9 items-center justify-center">
                {!isLoaded ? (
                  <div className="bg-muted/70 h-7 w-7 animate-pulse rounded-full" />
                ) : isSignedIn ? (
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-7 w-7",
                      },
                    }}
                  />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    title="Sign In"
                    onClick={() => openSignIn()}
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Sign In</span>
                  </Button>
                )}
              </div>

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
                className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-all focus-visible:ring-1 focus-visible:outline-none md:w-75"
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

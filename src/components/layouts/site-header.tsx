"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/layouts/main-nav";
import { MobileNav } from "@/components/layouts/mobile-nav";
// import { useCartStore } from "@/lib/stores/cart-store"
import { ThemeToggle } from "../themeToggle";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();
  // const { items } = useCartStore()

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
    setShowMobileMenu(false);
  }, [pathname]);

  // const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full px-5 transition-all duration-200",
        isScrolled
          ? "bg-background/95 border-b shadow-sm backdrop-blur-sm"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="hidden text-xl font-bold md:inline-block">
              {"Anubhav Projects's Lab"}
            </span>
            <span className="text-xl font-bold md:hidden">DS</span>
          </Link>
          <MainNav />
        </div>

        <div className="flex items-center gap-2">
          {!isSearchOpen ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="hover:bg-muted transition-all duration-200"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              <ThemeToggle />

              {/* <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link> */}

              <UserButton afterSignOutUrl="/" />

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowMobileMenu(true)}
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
                onClick={() => setIsSearchOpen(false)}
                className="ml-1"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {showMobileMenu && <MobileNav onClose={() => setShowMobileMenu(false)} />}
    </header>
  );
}

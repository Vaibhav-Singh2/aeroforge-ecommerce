"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Plane,
  Wrench,
  Cog,
  LucideIcon,
  ShoppingBag,
  Home,
  Printer,
  X,
  User,
  ChevronRight,
  Scale,
  Rocket,
  LayoutDashboard,
  Package,
  LogOut,
} from "lucide-react";
import { AeroForgeLogo } from "@/components/ui/logo";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Projects",
    href: "/category/projects",
    icon: Plane,
  },
  {
    title: "Parts & Accessories",
    href: "/category/parts-and-accessories",
    icon: ShoppingBag,
  },
  {
    title: "Drone Builder Studio",
    href: "/builder",
    icon: Rocket,
  },
  {
    title: "Repair Services",
    href: "/services/repair",
    icon: Wrench,
  },
  {
    title: "3D Printing Services",
    href: "/services/3d-printing",
    icon: Printer,
  },
  {
    title: "Compare Hardware",
    href: "/compare",
    icon: Scale,
  },
  {
    title: "My Account Dashboard",
    href: "/account",
    icon: LayoutDashboard,
  },
];

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn, signOut } = useClerk();

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-200 lg:hidden">
      <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col border-r bg-background shadow-2xl animate-in slide-in-from-left">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" onClick={onClose} className="flex items-center">
            <AeroForgeLogo />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        {/* Navigation Items */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-primary/70" />
                  )}
                </Link>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer Account Section */}
        <div className="border-t bg-muted/30 p-4">
          {!isLoaded ? (
            <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
          ) : isSignedIn ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border bg-background/80 p-2.5 shadow-xs">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border bg-muted">
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt="Avatar"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-xs font-bold font-mono">
                        {user?.firstName?.[0] || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="truncate text-xs font-semibold text-foreground">
                      {user?.fullName || user?.firstName || "AeroPilot"}
                    </span>
                    <span className="truncate text-[10px] text-muted-foreground font-mono">
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>
                <Link
                  href="/account"
                  onClick={onClose}
                  className="text-xs font-semibold text-primary hover:underline px-2 py-1"
                >
                  Hub
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/account/orders"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 rounded-lg border bg-background py-2 text-[11px] font-medium text-foreground hover:bg-muted"
                >
                  <Package className="h-3.5 w-3.5 text-primary" />
                  <span>Orders</span>
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    signOut();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg border bg-background py-2 text-[11px] font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <Button
              className="w-full justify-center gap-2 text-sm font-medium shadow-xs"
              onClick={() => {
                onClose();
                openSignIn();
              }}
            >
              <User className="h-4 w-4" />
              <span>Sign In / Register</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

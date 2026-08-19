"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
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
} from "lucide-react";

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
    title: "My Account",
    href: "/account",
    icon: Cog,
  },
];

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
      <div className="fixed inset-y-0 right-0 flex w-full max-w-xs flex-col border-l bg-background shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-foreground">
              AeroForge Labs
            </span>
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
            <div className="flex items-center justify-between rounded-lg border bg-background/60 p-2.5 shadow-xs">
              <div className="flex items-center gap-3 overflow-hidden">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8",
                    },
                  }}
                />
                <div className="flex flex-col truncate">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {user?.fullName || user?.firstName || "My Account"}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress || "Signed in"}
                  </span>
                </div>
              </div>
              <Link
                href="/account"
                onClick={onClose}
                className="text-xs font-medium text-primary hover:underline"
              >
                Profile
              </Link>
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

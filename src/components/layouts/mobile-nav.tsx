"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  Plane,
  Wrench,
  Cog,
  LucideIcon,
  ShoppingBag,
  Home,
  Printer,
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

  return (
    <div className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm md:hidden">
      <div className="bg-background fixed inset-y-0 right-0 w-full max-w-xs shadow-lg">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" onClick={onClose} className="flex items-center">
            <span className="text-xl font-bold">{`Anubhav Projects's Lab`}</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-64px)] pb-10">
          <div className="flex flex-col gap-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors",
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </div>
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Your Account</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

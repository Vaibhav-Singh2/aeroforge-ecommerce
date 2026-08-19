"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems: Array<{ title: string; href: string }> = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Projects",
    href: "/category/projects",
  },
  {
    title: "Parts & Accessories",
    href: "/category/parts-and-accessories",
  },
  {
    title: "Drone Builder",
    href: "/builder",
  },
  {
    title: "Repair Services",
    href: "/services/repair",
  },
  {
    title: "3D Printing",
    href: "/services/3d-printing",
  },
  {
    title: "Compare",
    href: "/compare",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden gap-3 xl:gap-5 lg:flex items-center">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "hover:text-primary text-xs xl:text-sm font-medium transition-colors whitespace-nowrap",
            pathname === item.href
              ? "text-foreground font-semibold"
              : "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
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
    title: "Repair Services",
    href: "/services/repair",
  },
  {
    title: "3D Printing Services",
    href: "/services/3d-printing",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="gap-6 md:flex">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "hover:text-primary text-sm font-medium transition-colors",
            pathname === item.href
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

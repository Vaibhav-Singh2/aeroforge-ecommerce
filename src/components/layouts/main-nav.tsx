"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Drones",
    href: "/category/drones",
  },
  {
    title: "Planes",
    href: "/category/planes",
  },
  {
    title: "Accessories",
    href: "/category/accessories",
  },
  {
    title: "Parts",
    href: "/category/parts",
  },
  {
    title: "Services",
    href: "/services",
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex gap-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Store,
  Package,
  Users,
  ShoppingBag,
  WrenchIcon,
  Printer,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/lib/admin/admin-provider";

const sidebarLinks = [
  { icon: Store, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
  { icon: WrenchIcon, label: "Repair Orders", href: "/admin/repair-orders" },
  { icon: Printer, label: "Print Orders", href: "/admin/print-orders" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdmin();

  return (
    <aside className="bg-background hidden w-64 flex-col border-r md:flex">
      <div className="flex h-16 items-center justify-center border-b px-6">
        <Link href="/admin/dashboard" className="text-xl font-bold">
          Admin Panel
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <button
          onClick={logout}
          className="hover:bg-muted flex w-full items-center rounded-md px-4 py-3 text-sm font-medium transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

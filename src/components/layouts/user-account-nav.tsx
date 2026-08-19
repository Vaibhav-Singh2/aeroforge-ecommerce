"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  User,
  LayoutDashboard,
  Package,
  Wrench,
  Printer,
  MapPin,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function UserAccountNav() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, openSignIn } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return <div className="h-8 w-8 rounded-full bg-muted/60 animate-pulse" />;
  }

  if (!isSignedIn) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => openSignIn()}
        className="gap-2 h-9 px-3 text-xs font-semibold hover:border-primary/50 transition-all"
      >
        <User className="h-4 w-4 text-primary" />
        <span>Sign In</span>
      </Button>
    );
  }

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user.firstName
      ? user.firstName[0].toUpperCase()
      : user.username
      ? user.username[0].toUpperCase()
      : "U";

  const displayName =
    user.fullName || user.firstName || user.username || "Pilot";
  const primaryEmail = user.primaryEmailAddress?.emailAddress || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 rounded-full p-1 text-left transition-all hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/50 group"
          title="Account Menu"
        >
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted shadow-xs ring-1 ring-border/50">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={displayName}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-xs font-bold font-mono">
                {initials}
              </div>
            )}
          </div>
          <span className="text-xs font-semibold text-foreground line-clamp-1 max-w-[100px] hidden 2xl:inline-block pl-1">
            {displayName}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 hidden sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-xl p-1.5 shadow-xl border bg-popover/95 backdrop-blur-md"
      >
        {/* User Summary Header */}
        <DropdownMenuLabel className="p-2.5 font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-foreground truncate">
                {displayName}
              </p>
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 font-mono text-sky-500 border-sky-500/30 bg-sky-500/10"
              >
                AeroPilot
              </Badge>
            </div>
            {primaryEmail && (
              <p className="text-[11px] text-muted-foreground truncate font-mono">
                {primaryEmail}
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Custom Internal Account Hub Links */}
        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-lg py-2">
            <Link href="/account" className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              <span className="font-medium">Account Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-lg py-2">
            <Link href="/account/orders" className="flex items-center gap-2.5">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-medium">Orders & GST Invoices</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-lg py-2">
            <Link href="/account/repair-orders" className="flex items-center gap-2.5">
              <Wrench className="h-4 w-4 text-primary" />
              <span className="font-medium">Hardware Repair Jobs</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-lg py-2">
            <Link href="/account/print-orders" className="flex items-center gap-2.5">
              <Printer className="h-4 w-4 text-primary" />
              <span className="font-medium">3D Printing Jobs</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-lg py-2">
            <Link href="/account/addresses" className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Saved Addresses</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-lg py-2">
            <Link href="/account/settings" className="flex items-center gap-2.5">
              <Settings className="h-4 w-4 text-primary" />
              <span className="font-medium">Account Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Sign Out Action */}
        <DropdownMenuItem
          onClick={() => signOut(() => router.push("/"))}
          className="cursor-pointer text-xs rounded-lg py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 mr-2.5" />
          <span className="font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

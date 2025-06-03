"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Package, User, MapPin, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AccountDashboard() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <User className="text-muted-foreground mb-4 h-16 w-16" />
              <h2 className="mb-2 text-xl font-semibold">
                Sign in to view your account
              </h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to access your account dashboard.
              </p>
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>

      {/* User profile summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome back, {user.firstName || user.username}</CardTitle>
          <CardDescription>
            Manage your account and view your order history
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Email address</div>
            <div className="text-muted-foreground text-sm">
              {user.emailAddresses[0]?.emailAddress}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Account created</div>
            <div className="text-muted-foreground text-sm">
              {new Date(user.createdAt!).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Orders</CardTitle>
            <CardDescription>View and track your recent orders</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Check the status of recent orders</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link href="/account/orders">View Order History</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Shipping Addresses</CardTitle>
            <CardDescription>Manage your shipping addresses</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Add or update your shipping addresses</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link href="/account/addresses">Manage Addresses</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Profile Settings</CardTitle>
            <CardDescription>Update your account information</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Update your personal information and preferences</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link href="/account/settings">Account Settings</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Continue Shopping</CardTitle>
            <CardDescription>Explore our products</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Browse our latest collections</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link href="/category/projects">Browse Products</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

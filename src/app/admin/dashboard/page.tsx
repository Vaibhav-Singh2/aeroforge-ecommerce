"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin/admin-provider";

// Admin UI components
import AdminHeader from "@/components/admin/admin-header";
import AdminSidebar from "@/components/admin/admin-sidebar";
import DashboardCards from "@/components/admin/dashboard-cards";

export default function AdminDashboard() {
  const { admin, isLoading } = useAdmin();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !admin) {
      router.push("/admin/login");
    }
  }, [admin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader title="Dashboard" />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

          <DashboardCards />

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-background rounded-lg border p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Recent Orders</h2>
              <p className="text-muted-foreground">Loading recent orders...</p>
            </div>

            <div className="bg-background rounded-lg border p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Low Stock Products</h2>
              <p className="text-muted-foreground">
                Loading stock information...
              </p>
            </div>

            <div className="bg-background rounded-lg border p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Recent Activities</h2>
              <p className="text-muted-foreground">No recent activities</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

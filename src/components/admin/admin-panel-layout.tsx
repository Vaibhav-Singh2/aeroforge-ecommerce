import React from "react";
import AdminHeader from "@/components/admin/admin-header";
import AdminSidebar from "@/components/admin/admin-sidebar";

interface AdminPanelLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminPanelLayout({
  title,
  children,
}: AdminPanelLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader title={title} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}

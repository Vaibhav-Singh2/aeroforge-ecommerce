"use client";

import React from "react";
import { Menu, Bell } from "lucide-react";
import { useAdmin } from "@/lib/admin/admin-provider";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const { admin } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <header className="bg-background sticky top-0 z-10 border-b shadow-sm">
      <div className="flex h-16 items-center px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <div className="ml-4 md:ml-0">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <div className="flex items-center space-x-4">
            <div className="font-medium">{admin?.name}</div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="bg-background absolute top-0 left-0 h-full w-64 border-r">
            {/* Mobile sidebar content */}
          </div>
        </div>
      )}
    </header>
  );
}

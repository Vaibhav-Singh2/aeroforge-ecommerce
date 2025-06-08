import { AdminProvider } from "@/lib/admin/admin-provider";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel | Drone Store",
  description: "Admin panel for Drone Store",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}

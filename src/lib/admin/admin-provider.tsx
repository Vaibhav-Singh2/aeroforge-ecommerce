"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminContext = createContext<AdminContextType>({
  admin: null,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: () => {},
});

export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if admin is logged in on initial load
  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const res = await fetch("/api/admin/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.admin) {
            setAdmin(data.admin);
          }
        }
      } catch (error) {
        console.error("Failed to verify admin session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setAdmin(data.admin);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      setAdmin(null);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AdminContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

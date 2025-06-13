"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin/get-admin-session";

export interface StoreSettings {
  id: string;
  siteName: string;
  siteDescription: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: {
    street: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  } | null;
  socialLinks: {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    youtube: string | null;
  } | null;
  shippingOptions: {
    id: string;
    name: string;
    price: number;
    estimatedDeliveryDays: number;
    isDefault: boolean;
  }[];
  taxSettings: {
    rate: number;
    applyToShipping: boolean;
  } | null;
}

// Get site settings
export async function getSiteSettings() {
  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const siteSettings = await prisma.siteSettings.findFirst();

    if (!siteSettings) {
      // If no settings exist, create default settings
      return { success: true, siteSettings: null };
    }

    return { success: true, siteSettings };
  } catch (error) {
    console.error("Failed to get site settings:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get site settings",
    };
  }
}

// Update site settings
export async function updateSiteSettings(formData: FormData) {
  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }
    const siteName = formData.get("siteName") as string;
    const siteDescription = formData.get("siteDescription") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const contactPhone = formData.get("contactPhone") as string;
    // Update or create the site settings
    const updatedSettings = await prisma.siteSettings.upsert({
      where: {
        id: (formData.get("id") as string) || "default",
      },
      update: {
        siteName,
        siteDescription,
        contactEmail,
        contactPhone,
      },
      create: {
        siteName,
        siteDescription,
        contactEmail,
        contactPhone,
      },
    });

    // Revalidate the settings page to update the UI
    revalidatePath("/admin/settings");
    return { success: true, settings: updatedSettings };
  } catch (error) {
    console.error("Failed to update site settings:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update site settings",
    };
  }
}

// Update admin profile
export async function updateAdminProfile(formData: FormData) {
  try {
    // Check if admin is authenticated
    const admin = await getAdminSession();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) {
      return { success: false, error: "Name and email are required" };
    }

    const updatedAdmin = await prisma.admin.update({
      where: {
        id: admin.id,
      },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return { success: true, admin: updatedAdmin };
  } catch (error) {
    console.error("Failed to update admin profile:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update admin profile",
    };
  }
}

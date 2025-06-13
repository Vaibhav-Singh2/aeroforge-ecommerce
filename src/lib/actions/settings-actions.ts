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
  address: Record<string, unknown> | null; // Storing as JSON in the database
  socialLinks: Record<string, unknown> | null; // Storing as JSON in the database
  currency: string;
  taxRate: number;
  shippingRates: Record<string, unknown>[]; // Shipping options stored as JSON
  enableReviews: boolean;
  enableRepairs: boolean;
  enable3DPrinting: boolean;
  maintenanceMode: boolean;
  updatedAt: string;
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

    // Create a properly typed version of the settings
    const typedSettings: StoreSettings = {
      id: siteSettings.id,
      siteName: siteSettings.siteName,
      siteDescription: siteSettings.siteDescription,
      logoUrl: siteSettings.logoUrl,
      faviconUrl: siteSettings.faviconUrl,
      contactEmail: siteSettings.contactEmail,
      contactPhone: siteSettings.contactPhone,
      // Type cast JSON fields properly
      address: siteSettings.address as Record<string, unknown> | null,
      socialLinks: siteSettings.socialLinks as Record<string, unknown> | null,
      currency: siteSettings.currency,
      taxRate: siteSettings.taxRate,
      shippingRates: siteSettings.shippingRates as Record<string, unknown>[],
      enableReviews: siteSettings.enableReviews,
      enableRepairs: siteSettings.enableRepairs,
      enable3DPrinting: siteSettings.enable3DPrinting,
      maintenanceMode: siteSettings.maintenanceMode,
      updatedAt: siteSettings.updatedAt.toISOString(),
    };

    return { success: true, siteSettings: typedSettings };
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

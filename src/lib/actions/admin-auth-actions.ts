"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// Schema for login form validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Admin login action
export async function adminLogin(formData: FormData) {
  // Validate form data
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!admin) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET || "default_secret",
    );

    const token = await new jose.SignJWT({ adminId: admin.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    // Set cookies
    (await cookies()).set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return {
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

// Admin logout action
export async function adminLogout() {
  (await cookies()).delete("admin_token");
  redirect("/admin/login");
}

// Check admin session
export async function getAdminSession() {
  try {
    // Get the token from the session cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return null;
    }

    // Verify and decode the token
    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET || "default_secret",
    );

    let adminId: string;

    try {
      const { payload } = await jose.jwtVerify(token, secret);
      adminId = payload.adminId as string;

      if (!adminId) {
        return null;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }

    // Fetch the admin from the database
    const admin = await prisma.admin.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return admin;
  } catch (error) {
    console.error("Failed to verify admin session:", error);
    return null;
  }
}

// Auth middleware function for protecting routes
export async function adminAuthMiddleware() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

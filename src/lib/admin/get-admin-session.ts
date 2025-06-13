"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import * as jose from "jose";

// Function to get the current admin session
export async function getAdminSession() {
  try {
    // Get the token from the session cookie
    const token = cookies().get("admin_token")?.value;

    if (!token) {
      return null;
    } // Verify and decode the token
    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET || "default_secret",
    );

    try {
      const { payload } = await jose.jwtVerify(token, secret);
      const adminId = payload.adminId as string;

      if (!adminId) {
        return null;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    } // Fetch the admin from the database
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

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/admin/auth-utils";

export const adminAuthMiddleware = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  // Allow access to admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check if the path is under admin
  if (pathname.startsWith("/admin")) {
    // Get the admin token from cookies
    const adminToken = (await cookies()).get("admin_token")?.value;

    if (!adminToken) {
      // Redirect to the admin login page
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      // Verify the token
      const admin = await verifyToken(adminToken);

      if (!admin) {
        // If token is invalid, redirect to login
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      // Admin is authenticated, allow access
      return NextResponse.next();
    } catch (error) {
      console.error("Admin token verification failed:", error);
      // If token verification fails, redirect to login
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
};

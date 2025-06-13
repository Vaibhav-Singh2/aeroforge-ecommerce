import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/actions/admin-auth-actions";

export async function adminMiddleware(req: Request) {
  // Check if the admin is authenticated
  const admin = await getAdminSession();

  // If not authenticated and trying to access protected routes, redirect to login
  if (!admin) {
    const url = new URL("/admin/login", req.url);
    // Add returnUrl to redirect back after login
    url.searchParams.set("returnUrl", new URL(req.url).pathname);
    return NextResponse.redirect(url);
  }

  // Continue with authenticated admin
  return NextResponse.next();
}

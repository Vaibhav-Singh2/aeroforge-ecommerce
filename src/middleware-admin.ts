import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply this middleware to admin routes (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Check for admin token
    const adminToken = request.cookies.get("admin_token")?.value;

    // If no token, redirect to login
    if (!adminToken) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("returnUrl", encodeURIComponent(pathname));
      return NextResponse.redirect(url);
    }
  }

  // Continue for all other routes
  return NextResponse.next();
}

// Configure the middleware to run only for admin routes
export const config = {
  matcher: ["/admin/:path*"],
};

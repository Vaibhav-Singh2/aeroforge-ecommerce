import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  // Auth routes
  "/sign-in(.*)",
  "/sign-up(.*)",
  // Public pages
  "/",
  "/category(.*)",
  "/product(.*)",
  // Public API routes if needed
  "/api/webhooks(.*)",
]);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/cart(.*)",
  "/checkout(.*)",
  "/account(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is public, allow access without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  if (isProtectedRoute(req)) {
    // If user is not authenticated, redirect to sign-in
    if (!(await auth()).sessionId) {
      // Store the current URL to redirect back after sign-in
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);

      // Redirect to sign-in page
      return NextResponse.redirect(signInUrl);
    }
  }

  // If user is authenticated but trying to access auth pages
  if (
    (await auth()).sessionId &&
    (req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    // Redirect to home page
    return NextResponse.redirect(new URL("/", req.url));
  }

  // For all other cases, allow the request to continue
  return NextResponse.next();
});

// Export configurations
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - admin (handled by middleware-admin.ts)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!admin|api|_next/static|_next/image|favicon.ico).*)",
  ],
};

import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin/auth-utils";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Authenticate admin
    const result = await authenticateAdmin(email, password);

    if (!result.success || !result.token) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 },
      );
    }

    // Create response with token cookie
    const response = NextResponse.json({
      success: true,
      admin: result.admin,
    });

    if (!result.token) {
      throw new Error("Token is required for admin login");
    }

    // Set the cookie in the response
    response.cookies.set("admin_token", result.token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}

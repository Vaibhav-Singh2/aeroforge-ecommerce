import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authenticateAdmin } from "@/lib/admin/auth-utils";

export async function POST(request: NextRequest) {
  try {
    // Get credentials from request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Authenticate admin
    const result = await authenticateAdmin(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 },
      );
    }

    // Set admin token cookie
    cookies().set({
      name: "admin_token",
      value: result.token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      admin: result.admin,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

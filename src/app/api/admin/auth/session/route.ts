import { NextResponse } from "next/server";
import { getAdminFromToken } from "@/lib/admin/auth-utils";

export async function GET() {
  try {
    // Get admin from token
    const admin = await getAdminFromToken();

    if (!admin) {
      return NextResponse.json({ admin: null });
    }

    // Return admin data without sensitive information
    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 },
    );
  }
}

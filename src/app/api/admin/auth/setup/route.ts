import { NextRequest, NextResponse } from "next/server";
import { setupDefaultAdmin } from "@/lib/admin/auth-utils";

export async function POST(request: NextRequest) {
  // Check for a secret token for added security
  const authorization = request.headers.get("authorization");

  if (
    !authorization ||
    authorization !== `Bearer ${process.env.SETUP_SECRET_TOKEN}`
  ) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    // Setup default admin
    await setupDefaultAdmin();

    return NextResponse.json({
      success: true,
      message: "Default admin created successfully",
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  try {
    // Generate a unique filename
    const filename = `${folder}/${nanoid()}-${file.name.replace(/\s+/g, "-")}`;

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
      token: process.env.NEXT_PUBLIC_VERCEL_BLOB_TOKEN,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

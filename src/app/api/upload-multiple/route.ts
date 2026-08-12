import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];
  const folder = (formData.get("folder") as string) || "uploads";

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "Files are required" }, { status: 400 });
  }

  try {
    const uploadPromises = files.map(async (file) => {
      const filename = `${folder}/${nanoid()}-${file.name.replace(/\s+/g, "-")}`;
      const { url } = await put(filename, file, {
        access: "public",
        token: process.env.NEXT_PUBLIC_VERCEL_BLOB_TOKEN,
      });
      return url;
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 },
    );
  }
}

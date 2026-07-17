import { NextResponse } from "next/server";
import { getAuthAdmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { createHash } from "crypto";

export async function POST(request: Request) {
  const admin = await getAuthAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  if (!rateLimit(`upload:${ip}`, 10, 60000)) {
    return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum 5MB" },
        { status: 400 }
      );
    }

    // Convert to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = createHash("sha1")
      .update(`folder=copit/products&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: dataUrl,
          folder: "copit/products",
          timestamp,
          api_key: apiKey,
          signature,
        }),
      }
    );

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      );
    }

    const result = await uploadResponse.json();

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

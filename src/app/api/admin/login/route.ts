import { NextResponse } from "next/server";
import { verifyAdmin, signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  // Rate limit: 5 login attempts per minute
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  if (!rateLimit(`login:${ip}`, 5, 60000)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    let admin;
    try {
      admin = await verifyAdmin(parsed.data.email, parsed.data.password);
    } catch {
      return NextResponse.json(
        { error: "Database not connected. Run: npx prisma db push && npm run seed" },
        { status: 503 }
      );
    }
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken(admin);

    const response = NextResponse.json({ success: true });
    response.headers.set(
      "Set-Cookie",
      `copit_admin_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`
    );

    return response;
  } catch (error) {
    console.error("POST /api/admin/login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

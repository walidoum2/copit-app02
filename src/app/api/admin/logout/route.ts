import { NextResponse } from "next/server";
import { getAuthAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const admin = await getAuthAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    `copit_admin_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
  );
  return response;
}

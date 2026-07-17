import { NextRequest, NextResponse } from "next/server";
import { getAuthAdmin, prisma } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const settings = await prisma.landingSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return NextResponse.json({ settings: map });
  } catch {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { key, value } = body;
    if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
    await prisma.landingSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
  }
}

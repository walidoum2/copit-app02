import { NextRequest, NextResponse } from "next/server";
import { getAuthAdmin, prisma } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const section = req.nextUrl.searchParams.get("section");
  try {
    const where = section ? { section } : {};
    const slides = await prisma.homeSlide.findMany({ where, orderBy: { position: "asc" } });
    return NextResponse.json({ slides });
  } catch {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.section) return NextResponse.json({ error: "section required" }, { status: 400 });
    const slide = await prisma.homeSlide.create({ data: body });
    return NextResponse.json({ slide });
  } catch {
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const slide = await prisma.homeSlide.update({ where: { id }, data });
    return NextResponse.json({ slide });
  } catch {
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    await prisma.homeSlide.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}

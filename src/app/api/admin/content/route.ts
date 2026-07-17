import { NextRequest, NextResponse } from "next/server";
import { getAuthAdmin, prisma } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return unauthorized();
  const type = req.nextUrl.searchParams.get("type");
  try {
    switch (type) {
      case "faq": {
        const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json({ faqs });
      }
      case "whyus": {
        const items = await prisma.whyUsItem.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json({ items });
      }
      case "brands": {
        const brands = await prisma.brandItem.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json({ brands });
      }
      case "categories": {
        const categories = await prisma.categoryContent.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json({ categories });
      }
      case "footer": {
        const links = await prisma.footerLink.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json({ links });
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return unauthorized();
  const type = req.nextUrl.searchParams.get("type");
  const body = await req.json();
  try {
    switch (type) {
      case "faq": {
        const faq = await prisma.faq.create({ data: body });
        return NextResponse.json({ faq });
      }
      case "whyus": {
        const item = await prisma.whyUsItem.create({ data: body });
        return NextResponse.json({ item });
      }
      case "brands": {
        const brand = await prisma.brandItem.create({ data: body });
        return NextResponse.json({ brand });
      }
      case "categories": {
        const cat = await prisma.categoryContent.create({ data: body });
        return NextResponse.json({ cat });
      }
      case "footer": {
        const link = await prisma.footerLink.create({ data: body });
        return NextResponse.json({ link });
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return unauthorized();
  const type = req.nextUrl.searchParams.get("type");
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    switch (type) {
      case "faq": {
        const faq = await prisma.faq.update({ where: { id }, data });
        return NextResponse.json({ faq });
      }
      case "whyus": {
        const item = await prisma.whyUsItem.update({ where: { id }, data });
        return NextResponse.json({ item });
      }
      case "brands": {
        const brand = await prisma.brandItem.update({ where: { id }, data });
        return NextResponse.json({ brand });
      }
      case "categories": {
        const cat = await prisma.categoryContent.update({ where: { id }, data });
        return NextResponse.json({ cat });
      }
      case "footer": {
        const link = await prisma.footerLink.update({ where: { id }, data });
        return NextResponse.json({ link });
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return unauthorized();
  const type = req.nextUrl.searchParams.get("type");
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    switch (type) {
      case "faq": await prisma.faq.delete({ where: { id } }); break;
      case "whyus": await prisma.whyUsItem.delete({ where: { id } }); break;
      case "brands": await prisma.brandItem.delete({ where: { id } }); break;
      case "categories": await prisma.categoryContent.delete({ where: { id } }); break;
      case "footer": await prisma.footerLink.delete({ where: { id } }); break;
      default: return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

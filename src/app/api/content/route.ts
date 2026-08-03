import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  try {
    switch (type) {
      case "faq": {
        const faqs = await prisma.faq.findMany({ where: { active: true }, orderBy: { order: "asc" } });
        return NextResponse.json({ faqs });
      }
      case "whyus": {
        const items = await prisma.whyUsItem.findMany({ where: { active: true }, orderBy: { order: "asc" } });
        return NextResponse.json({ items });
      }
      case "brands": {
        const brands = await prisma.brandItem.findMany({ where: { active: true }, orderBy: { order: "asc" } });
        return NextResponse.json({ brands });
      }
      case "categories": {
        const categories = await prisma.categoryContent.findMany({ where: { active: true }, orderBy: { order: "asc" } });
        return NextResponse.json({ categories });
      }
      case "footer": {
        const links = await prisma.footerLink.findMany({ where: { active: true }, orderBy: { order: "asc" } });
        return NextResponse.json({ links });
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (e) {
    if (req.nextUrl.searchParams.get("debug")) {
      return NextResponse.json(
        { error: "Database not available", detail: e instanceof Error ? `${e.name}: ${e.message}` : String(e) },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }
}

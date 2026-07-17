import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

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
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }
}

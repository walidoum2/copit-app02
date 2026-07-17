import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") || "new_arrival";
  try {
    const slides = await prisma.homeSlide.findMany({
      where: { section, active: true },
      orderBy: { position: "asc" },
    });
    return NextResponse.json({ slides }, { headers: { "Cache-Control": "no-store, must-revalidate" } });
  } catch {
    return NextResponse.json({ slides: [] });
  }
}

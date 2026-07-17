import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { FALLBACK_SHIPPING } from "@/data/fallback";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rates = await prisma.shippingRate.findMany({
      orderBy: { wilayaCode: "asc" },
      select: { wilaya: true, homePrice: true, stopPrice: true, days: true },
    });
    return NextResponse.json({ rates }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ rates: FALLBACK_SHIPPING }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
    });
  }
}

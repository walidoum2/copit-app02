import { NextResponse } from "next/server";
import { getAuthAdmin, prisma } from "@/lib/auth";
import { shippingRateSchema } from "@/lib/validation";
import { z } from "zod";

const shippingUpdateSchema = z.object({
  rates: z.array(shippingRateSchema).min(1),
});

export async function GET(request: Request) {
  const admin = await getAuthAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rates = await prisma.shippingRate.findMany({
      orderBy: { wilayaCode: "asc" },
    });
    return NextResponse.json({ rates });
  } catch {
    return NextResponse.json({ rates: [] });
  }
}

export async function PUT(request: Request) {
  const admin = await getAuthAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = shippingUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid shipping data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { rates } = parsed.data;

    await prisma.$transaction(
      rates.map((r) =>
        prisma.shippingRate.updateMany({
          where: { wilaya: r.wilaya },
          data: {
            homePrice: r.homePrice,
            stopPrice: r.stopPrice,
            days: r.days,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update shipping rates" },
      { status: 500 }
    );
  }
}

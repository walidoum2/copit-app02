import { NextResponse } from "next/server";
import { getAuthAdmin, prisma } from "@/lib/auth";

const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function GET(request: Request) {
  const admin = await getAuthAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "50"));
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status && VALID_STATUSES.includes(status)) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ orders: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } });
  }
}

export async function PUT(request: Request) {
  const admin = await getAuthAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.order.updateMany({
      where: { id },
      data: { status },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

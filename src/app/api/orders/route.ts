import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { orderSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";
import { createProcolisShipment } from "@/lib/procolis";
import { randomUUID } from "crypto";
import { FREE_SHIP_THRESHOLD } from "@/data/dictionary";

const PHONE_REGEX = /^0[5-7]\d{8}$/;

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`order:${ip}`, 5, 60000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const verifiedItems: {
      variantId: string;
      size: string;
      color: string;
      price: number;
      quantity: number;
      productId: string;
      productName: string;
      brand: string;
    }[] = [];
    let serverSubtotal = 0;

    for (const item of data.items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant || !variant.product.active) {
        return NextResponse.json(
          { error: `Product variant not found: ${item.variantId}` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.product.name} (${item.size}/${item.color})` },
          { status: 400 }
        );
      }

      if (variant.product.price !== item.price) {
        return NextResponse.json(
          { error: `Price mismatch for ${variant.product.name}` },
          { status: 400 }
        );
      }

      serverSubtotal += variant.product.price * item.quantity;
      verifiedItems.push({
        ...item,
        productId: variant.productId,
        productName: variant.product.name,
        brand: variant.product.brand,
      });
    }

    const rate = await prisma.shippingRate.findUnique({
      where: { wilaya: data.wilaya },
    });

    if (!rate) {
      return NextResponse.json(
        { error: `Shipping rate not found for ${data.wilaya}` },
        { status: 400 }
      );
    }

    const serverShippingCost =
      data.deliveryType === "home" ? rate.homePrice : rate.stopPrice;
    const freeShippingThreshold = FREE_SHIP_THRESHOLD;
    const finalShippingCost =
      serverSubtotal >= freeShippingThreshold ? 0 : serverShippingCost;
    const serverTotal = serverSubtotal + finalShippingCost;

    if (serverSubtotal !== data.subtotal || serverTotal !== data.total) {
      return NextResponse.json(
        { error: "Order total mismatch. Please refresh and try again." },
        { status: 400 }
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      const orderId = `CP-${randomUUID().slice(0, 8).toUpperCase()}`;

      for (const item of verifiedItems) {
        const updated = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new Error(`Stock conflict for ${item.productName}`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          id: orderId,
          name: data.name,
          phone: data.phone,
          wilaya: data.wilaya,
          commune: data.commune,
          address: data.address,
          notes: data.notes,
          deliveryType: data.deliveryType,
          subtotal: serverSubtotal,
          shippingCost: finalShippingCost,
          total: serverTotal,
          items: {
            create: verifiedItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              brand: item.brand,
              size: item.size,
              color: item.color,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      return newOrder;
    });

    let procolisResult = null;
    try {
      procolisResult = await createProcolisShipment({
        orderRef: order.id,
        customerName: order.name,
        customerPhone: order.phone,
        wilaya: order.wilaya,
        commune: order.commune,
        address: order.address,
        total: order.total,
        itemCount: order.items.length,
        notes: order.notes || undefined,
      });

      if (procolisResult.success) {
        await prisma.order.update({
          where: { id: order.id },
          data: { procolisId: procolisResult.trackingId },
        });
      }
    } catch {
      // Procolis failure does not fail the order
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      procolisTracking: procolisResult?.trackingId || null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`track:${ip}`, 10, 60000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json(
      { error: "Phone number required" },
      { status: 400 }
    );
  }

  const cleanPhone = phone.replace(/\s/g, "");
  if (!PHONE_REGEX.test(cleanPhone)) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 }
    );
  }

  let orders;
  try {
    orders = await prisma.order.findMany({
      where: { phone: cleanPhone },
      select: {
        id: true,
        name: true,
        phone: true,
        wilaya: true,
        status: true,
        total: true,
        createdAt: true,
        procolisId: true,
        items: {
          select: {
            productName: true,
            brand: true,
            size: true,
            color: true,
            quantity: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch {
    const { FALLBACK_ORDERS } = await import("@/data/fallback");
    orders = FALLBACK_ORDERS.filter((o) => o.phone === cleanPhone);
  }

  return NextResponse.json({ orders });
}

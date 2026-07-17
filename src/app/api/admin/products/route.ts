import { NextResponse } from "next/server";
import { getAuthAdmin, prisma } from "@/lib/auth";
import { productSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const admin = await getAuthAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          variants: true,
          images: { orderBy: { order: "asc" } },
        },
        orderBy: [{ position: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await getAuthAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { images: productImages, ...data } = parsed.data;

    const product = await prisma.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          name: data.name,
          brand: data.brand,
          category: data.category,
          price: data.price,
          originalPrice: data.originalPrice,
          material: data.material,
          sku: data.sku,
          tag: data.tag,
          active: data.active ?? true,
        },
      });

      await tx.productVariant.createMany({
        data: data.variants.map((v) => ({
          productId: p.id,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stock: v.stock,
        })),
      });

      if (productImages?.length) {
        await tx.productImage.createMany({
          data: productImages.map((url: string, i: number) => ({
            productId: p.id,
            url,
            order: i,
          })),
        });
      }

      return p;
    });

    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const admin = await getAuthAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, variants, ...rest } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const { variants: _v, ...restData } = rest;
    const parsed = productSchema.partial().omit({ variants: true }).safeParse(restData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { images: productImages, ...data } = parsed.data;

    const product = await prisma.$transaction(async (tx) => {
      const existing = await tx.product.findUnique({ where: { id } });
      if (!existing) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const updated = await tx.product.update({
        where: { id },
        data,
      });

      if (variants && Array.isArray(variants)) {
        const variantSchema = productSchema.shape.variants;
        const parsedVariants = variantSchema.safeParse(variants);
        if (!parsedVariants.success) {
          throw new Error("INVALID_VARIANTS");
        }

        await tx.productVariant.deleteMany({ where: { productId: id } });
        await tx.productVariant.createMany({
          data: parsedVariants.data.map((v) => ({
            productId: id,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            stock: v.stock,
          })),
        });
      }

      if (productImages && Array.isArray(productImages)) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (productImages.length > 0) {
          await tx.productImage.createMany({
            data: productImages.map((url: string, i: number) => ({
              productId: id,
              url,
              order: i,
            })),
          });
        }
      }

      return updated;
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "INVALID_VARIANTS") {
      return NextResponse.json({ error: "Invalid variant data" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const admin = await getAuthAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const deleted = await prisma.product.deleteMany({ where: { id } });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

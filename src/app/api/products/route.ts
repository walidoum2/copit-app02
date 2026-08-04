import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { FALLBACK_PRODUCTS } from "@/data/fallback";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const promo = searchParams.get("promo");
  const brand = searchParams.get("brand");
  const latest = searchParams.get("latest") === "true" || searchParams.get("latest") === "1";
  const sort = searchParams.get("sort") || "position";

  try {
    const where: Record<string, unknown> = { active: true, showInMenu: true };
    if (category) where.category = category;
    if (brand) {
      where.brand = brand;
      where.showInBrandSection = true;
    }
    if (latest) {
      where.showOnHomepage = true;
      where.showInLatestSneakers = true;
    }
    const isPromo = promo === "true";
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: Array<{ position?: "asc" | "desc"; createdAt?: "asc" | "desc"; price?: "asc" | "desc" }> =
      sort === "newest"
        ? [{ createdAt: "desc" }]
        : sort === "price_asc"
          ? [{ price: "asc" }]
          : sort === "price_desc"
            ? [{ price: "desc" }]
            : [{ position: "asc" }, { createdAt: "desc" }];

    let allProducts = await prisma.product.findMany({
      where,
      include: { variants: true, images: { orderBy: { order: "asc" } } },
      orderBy,
    });

    if (isPromo) allProducts = allProducts.filter(p => p.originalPrice > p.price);

    const total = allProducts.length;
    const products = allProducts.slice((page - 1) * limit, page * limit);

    return NextResponse.json(
      { products, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch {
    // DB not available — return fallback demo data
    let fallback = FALLBACK_PRODUCTS;
    if (search) {
      const q = search.toLowerCase();
      fallback = fallback.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (category) {
      fallback = fallback.filter(p => p.category === category);
    }
    const total = fallback.length;
    const paginated = fallback.slice((page - 1) * limit, page * limit);
    const mapped = paginated.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      material: p.material,
      sku: p.sku,
      tag: p.tag || null,
      active: true,
      variants: p.sizes.flatMap(s =>
        p.colors.map(c => ({
          id: `${p.id}-${s.size}-${c.name}`,
          size: s.size,
          color: c.name,
          colorHex: c.hex,
          stock: s.stock,
        }))
      ),
      images: [],
    }));

    return NextResponse.json(
      { products: mapped, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
    );
  }
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const issues = [];

async function main() {
  const [products, orders, faqs, whys, brands, cats, links, slides, landingKeys] = await Promise.all([
    prisma.product.findMany({ include: { variants: true, images: true }, orderBy: { position: "asc" } }),
    prisma.order.count(),
    prisma.faq.count(),
    prisma.whyUsItem.count(),
    prisma.brandItem.count(),
    prisma.categoryContent.findMany(),
    prisma.footerLink.findMany({ orderBy: { order: "asc" } }),
    prisma.homeSlide.findMany(),
    prisma.landingSetting.findMany(),
  ]);

  console.log(`Orders: ${orders}`);
  console.log(`Products: ${products.length}`);
  console.log(`FAQ: ${faqs}, WhyUs: ${whys}, Brands: ${brands}, Categories: ${cats.length}, FooterLinks: ${links.length}, Slides: ${slides.length}, LandingKeys: ${landingKeys.length}`);

  const skuSeen = new Set();
  for (const p of products) {
    if (skuSeen.has(p.sku)) issues.push(`DUPLICATE SKU: ${p.sku} (${p.name})`);
    skuSeen.add(p.sku);
    if (p.variants.length === 0) issues.push(`NO VARIANTS: ${p.sku} (${p.name})`);
    if (p.images.length === 0) issues.push(`NO IMAGES: ${p.sku} (${p.name})`);
    if (p.price <= 0) issues.push(`BAD PRICE: ${p.sku} price=${p.price}`);
    if (p.originalPrice > 0 && p.originalPrice < p.price) issues.push(`PRICE>ORIGINAL: ${p.sku} price=${p.price} original=${p.originalPrice}`);
    const imgUrls = p.images.map(i => i.url);
    const dupUrls = imgUrls.filter((u, i) => imgUrls.indexOf(u) !== i);
    if (dupUrls.length) issues.push(`DUPLICATE IMAGES on ${p.sku}: ${[...new Set(dupUrls)].join(", ")}`);
    for (const img of p.images) {
      if (!img.url) issues.push(`EMPTY IMAGE URL on ${p.sku}`);
      if (img.url.length > 2_000_000) issues.push(`HUGE IMAGE (>2MB) on ${p.sku}: ${img.url.length} chars — base64 in DB, consider Cloudinary`);
    }
    const stockBy = new Set(p.variants.map(v => `${v.size}|${v.color}`));
    if (stockBy.size !== p.variants.length) issues.push(`DUP VARIANT (size|color) on ${p.sku}`);
  }

  for (const c of cats) {
    if (!c.nameFr && !c.nameAr && !c.nameEn) issues.push(`CATEGORY missing all names: ${c.id}`);
    if (c.imageUrl && !c.imageUrl.startsWith("data:") && !c.imageUrl.startsWith("http")) issues.push(`CATEGORY bad imageUrl: ${c.id}`);
  }
  for (const l of links) {
    if (!l.url) issues.push(`FOOTER LINK empty url: ${l.label || l.id}`);
    else if (!l.url.startsWith("/") && !l.url.startsWith("http") && !l.url.startsWith("tel:") && !l.url.startsWith("mailto:")) issues.push(`FOOTER LINK bad url: ${l.label || l.id} -> ${l.url}`);
  }
  for (const s of slides) {
    if (!s.active) continue;
    const imgs = (() => { try { return JSON.parse(s.imageUrls || "[]"); } catch { return []; } })();
    if (imgs.length === 0) issues.push(`ACTIVE SLIDE no images: ${s.title}`);
  }

  console.log(issues.length ? `\nISSUES (${issues.length}):\n- ${issues.join("\n- ")}` : "\nAll checks passed — no issues found.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

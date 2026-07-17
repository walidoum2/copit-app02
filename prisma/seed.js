import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const WILAYAS = [
  { name: "Adrar", code: 1, tier: 3 },
  { name: "Chlef", code: 2, tier: 2 },
  { name: "Laghouat", code: 3, tier: 3 },
  { name: "Oum El Bouaghi", code: 4, tier: 2 },
  { name: "Batna", code: 5, tier: 2 },
  { name: "Béjaïa", code: 6, tier: 2 },
  { name: "Biskra", code: 7, tier: 3 },
  { name: "Béchar", code: 8, tier: 3 },
  { name: "Blida", code: 9, tier: 1 },
  { name: "Bouira", code: 10, tier: 2 },
  { name: "Tamanrasset", code: 11, tier: 3 },
  { name: "Tébessa", code: 12, tier: 2 },
  { name: "Tlemcen", code: 13, tier: 2 },
  { name: "Tiaret", code: 14, tier: 2 },
  { name: "Tizi Ouzou", code: 15, tier: 2 },
  { name: "Alger", code: 16, tier: 1 },
  { name: "Djelfa", code: 17, tier: 2 },
  { name: "Jijel", code: 18, tier: 2 },
  { name: "Sétif", code: 19, tier: 2 },
  { name: "Saïda", code: 20, tier: 2 },
  { name: "Skikda", code: 21, tier: 2 },
  { name: "Sidi Bel Abbès", code: 22, tier: 2 },
  { name: "Annaba", code: 23, tier: 2 },
  { name: "Guelma", code: 24, tier: 2 },
  { name: "Constantine", code: 25, tier: 2 },
  { name: "Médéa", code: 26, tier: 2 },
  { name: "Mostaganem", code: 27, tier: 2 },
  { name: "M'Sila", code: 28, tier: 2 },
  { name: "Mascara", code: 29, tier: 2 },
  { name: "Ouargla", code: 30, tier: 3 },
  { name: "Oran", code: 31, tier: 2 },
  { name: "El Bayadh", code: 32, tier: 3 },
  { name: "Illizi", code: 33, tier: 3 },
  { name: "Bordj Bou Arréridj", code: 34, tier: 2 },
  { name: "Boumerdès", code: 35, tier: 1 },
  { name: "El Tarf", code: 36, tier: 2 },
  { name: "Tindouf", code: 37, tier: 3 },
  { name: "Tissemsilt", code: 38, tier: 2 },
  { name: "El Oued", code: 39, tier: 3 },
  { name: "Khenchela", code: 40, tier: 2 },
  { name: "Souk Ahras", code: 41, tier: 2 },
  { name: "Tipaza", code: 42, tier: 1 },
  { name: "Mila", code: 43, tier: 2 },
  { name: "Aïn Defla", code: 44, tier: 2 },
  { name: "Naâma", code: 45, tier: 3 },
  { name: "Aïn Témouchent", code: 46, tier: 2 },
  { name: "Ghardaïa", code: 47, tier: 3 },
  { name: "Relizane", code: 48, tier: 2 },
  { name: "Timimoun", code: 49, tier: 3 },
  { name: "Bordj Badji Mokhtar", code: 50, tier: 3 },
  { name: "Ouled Djellal", code: 51, tier: 3 },
  { name: "Béni Abbès", code: 52, tier: 3 },
  { name: "In Salah", code: 53, tier: 3 },
  { name: "In Guezzam", code: 54, tier: 3 },
  { name: "Touggourt", code: 55, tier: 3 },
  { name: "Djanet", code: 56, tier: 3 },
  { name: "El M'Ghair", code: 57, tier: 3 },
  { name: "El Meniaa", code: 58, tier: 3 },
];

function defaultRates(tier) {
  switch (tier) {
    case 1: return { homePrice: 400, stopPrice: 250, days: "24-48h" };
    case 2: return { homePrice: 650, stopPrice: 450, days: "2-4 jours" };
    case 3: return { homePrice: 1000, stopPrice: 750, days: "4-7 jours" };
  }
}

async function main() {
  for (const w of WILAYAS) {
    const rates = defaultRates(w.tier);
    await prisma.shippingRate.upsert({
      where: { wilaya: w.name },
      update: {},
      create: {
        wilaya: w.name,
        wilayaCode: w.code,
        homePrice: rates.homePrice,
        stopPrice: rates.stopPrice,
        days: rates.days,
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@copit.dz";
  const adminPassword = process.env.ADMIN_PASSWORD || "CopIt2026!";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",
    },
  });

  const products = [
    {
      name: "1460 Smooth Leather Boots",
      brand: "Dr. Martens",
      category: "Chaussures",
      price: 16500,
      originalPrice: 19900,
      material: "Cuir Smooth",
      sku: "CP-DM-1460",
      tag: "Best-seller",
      variants: [
        { size: "40", color: "Noir", colorHex: "#111111", stock: 2 },
        { size: "41", color: "Noir", colorHex: "#111111", stock: 5 },
        { size: "42", color: "Noir", colorHex: "#111111", stock: 1 },
        { size: "43", color: "Noir", colorHex: "#111111", stock: 0 },
        { size: "44", color: "Noir", colorHex: "#111111", stock: 4 },
        { size: "40", color: "Cherry", colorHex: "#7a1f1f", stock: 2 },
        { size: "41", color: "Cherry", colorHex: "#7a1f1f", stock: 3 },
        { size: "42", color: "Cherry", colorHex: "#7a1f1f", stock: 2 },
      ],
    },
    {
      name: "HOVR Phantom 3",
      brand: "Under Armour",
      category: "Chaussures",
      price: 12000,
      originalPrice: 14500,
      material: "Mesh technique",
      sku: "CP-UA-HP3",
      tag: "Nouveau",
      variants: [
        { size: "39", color: "Blanc", colorHex: "#eeeeee", stock: 6 },
        { size: "40", color: "Blanc", colorHex: "#eeeeee", stock: 6 },
        { size: "41", color: "Blanc", colorHex: "#eeeeee", stock: 3 },
        { size: "42", color: "Blanc", colorHex: "#eeeeee", stock: 6 },
        { size: "43", color: "Blanc", colorHex: "#eeeeee", stock: 2 },
        { size: "40", color: "Gris", colorHex: "#888888", stock: 4 },
        { size: "42", color: "Gris", colorHex: "#888888", stock: 3 },
      ],
    },
    {
      name: "Lafrancé Suede Runner",
      brand: "Puma",
      category: "Chaussures",
      price: 9800,
      originalPrice: 12000,
      material: "Suède",
      sku: "CP-PM-LFR",
      tag: "Édition Limitée",
      variants: [
        { size: "40", color: "Beige", colorHex: "#cbb894", stock: 3 },
        { size: "41", color: "Beige", colorHex: "#cbb894", stock: 0 },
        { size: "42", color: "Beige", colorHex: "#cbb894", stock: 5 },
        { size: "43", color: "Beige", colorHex: "#cbb894", stock: 5 },
        { size: "44", color: "Beige", colorHex: "#cbb894", stock: 1 },
        { size: "42", color: "Noir", colorHex: "#151515", stock: 3 },
        { size: "43", color: "Noir", colorHex: "#151515", stock: 4 },
      ],
    },
    {
      name: "D3 2001 Platform",
      brand: "Osiris",
      category: "Chaussures",
      price: 8900,
      originalPrice: 10500,
      material: "Cuir synthétique",
      sku: "CP-OS-D3",
      tag: "Skate",
      variants: [
        { size: "39", color: "Vert Militaire", colorHex: "#3d4a30", stock: 1 },
        { size: "40", color: "Vert Militaire", colorHex: "#3d4a30", stock: 4 },
        { size: "41", color: "Vert Militaire", colorHex: "#3d4a30", stock: 4 },
        { size: "42", color: "Vert Militaire", colorHex: "#3d4a30", stock: 0 },
        { size: "43", color: "Vert Militaire", colorHex: "#3d4a30", stock: 3 },
        { size: "40", color: "Noir", colorHex: "#111111", stock: 2 },
        { size: "41", color: "Noir", colorHex: "#111111", stock: 3 },
      ],
    },
    {
      name: "Air Retro Court",
      brand: "Jordan",
      category: "Chaussures",
      price: 19500,
      originalPrice: 23000,
      material: "Cuir premium",
      sku: "CP-JD-ARC",
      tag: "Hype",
      variants: [
        { size: "40", color: "Rouge/Noir", colorHex: "#a12020", stock: 0 },
        { size: "41", color: "Rouge/Noir", colorHex: "#a12020", stock: 2 },
        { size: "42", color: "Rouge/Noir", colorHex: "#a12020", stock: 2 },
        { size: "43", color: "Rouge/Noir", colorHex: "#a12020", stock: 1 },
        { size: "44", color: "Rouge/Noir", colorHex: "#a12020", stock: 0 },
      ],
    },
    {
      name: "Oversized Hoodie",
      brand: "CopIt Basics",
      category: "Vêtements",
      price: 4500,
      originalPrice: 5500,
      material: "Coton molletonné 320g",
      sku: "CP-BS-HD1",
      tag: "Essentiel",
      variants: [
        { size: "S", color: "Noir", colorHex: "#111111", stock: 8 },
        { size: "M", color: "Noir", colorHex: "#111111", stock: 10 },
        { size: "L", color: "Noir", colorHex: "#111111", stock: 6 },
        { size: "XL", color: "Noir", colorHex: "#111111", stock: 2 },
        { size: "S", color: "Sable", colorHex: "#c9b89a", stock: 5 },
        { size: "M", color: "Sable", colorHex: "#c9b89a", stock: 7 },
      ],
    },
    {
      name: "Cargo Tech Pants",
      brand: "CopIt Basics",
      category: "Vêtements",
      price: 5200,
      originalPrice: 6200,
      material: "Ripstop",
      sku: "CP-BS-CG1",
      tag: "Nouveau",
      variants: [
        { size: "S", color: "Kaki", colorHex: "#5c5b45", stock: 4 },
        { size: "M", color: "Kaki", colorHex: "#5c5b45", stock: 7 },
        { size: "L", color: "Kaki", colorHex: "#5c5b45", stock: 5 },
        { size: "XL", color: "Kaki", colorHex: "#5c5b45", stock: 0 },
        { size: "M", color: "Noir", colorHex: "#151515", stock: 4 },
        { size: "L", color: "Noir", colorHex: "#151515", stock: 3 },
      ],
    },
    {
      name: "Bucket Hat Signature",
      brand: "CopIt Basics",
      category: "Accessoires",
      price: 1800,
      originalPrice: 2200,
      material: "Coton canvas",
      sku: "CP-BS-BK1",
      tag: "",
      variants: [
        { size: "Unique", color: "Noir", colorHex: "#111111", stock: 12 },
        { size: "Unique", color: "Orange", colorHex: "#ff4b1f", stock: 8 },
      ],
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        material: p.material,
        tag: p.tag,
      },
      create: {
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        material: p.material,
        sku: p.sku,
        tag: p.tag,
      },
    });

    for (const v of p.variants) {
      await prisma.productVariant.upsert({
        where: { productId_size_color: { productId: product.id, size: v.size, color: v.color } },
        update: { stock: v.stock, colorHex: v.colorHex },
        create: {
          productId: product.id,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stock: v.stock,
        },
      });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

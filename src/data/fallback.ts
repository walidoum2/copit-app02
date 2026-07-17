export interface FallbackProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  material: string;
  sku: string;
  tag: string;
  sizes: { size: string; stock: number }[];
  colors: { name: string; hex: string }[];
}

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  { id: "fb-1", name: "1460 Smooth Leather Boots", brand: "Dr. Martens", category: "Chaussures", price: 16500, originalPrice: 19900, material: "Cuir Smooth", sku: "CP-DM-1460", tag: "Best-seller", sizes: [{ size: "40", stock: 2 }, { size: "41", stock: 5 }, { size: "42", stock: 1 }, { size: "43", stock: 0 }, { size: "44", stock: 4 }], colors: [{ name: "Noir", hex: "#111111" }, { name: "Cherry", hex: "#7a1f1f" }] },
  { id: "fb-2", name: "HOVR Phantom 3", brand: "Under Armour", category: "Chaussures", price: 12000, originalPrice: 14500, material: "Mesh technique", sku: "CP-UA-HP3", tag: "Nouveau", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 3 }, { size: "42", stock: 6 }, { size: "43", stock: 2 }], colors: [{ name: "Blanc", hex: "#eeeeee" }, { name: "Gris", hex: "#888888" }] },
  { id: "fb-3", name: "Lafrancé Suede Runner", brand: "Puma", category: "Chaussures", price: 9800, originalPrice: 12000, material: "Suède", sku: "CP-PM-LFR", tag: "Édition Limitée", sizes: [{ size: "40", stock: 3 }, { size: "41", stock: 0 }, { size: "42", stock: 5 }, { size: "43", stock: 5 }, { size: "44", stock: 1 }], colors: [{ name: "Beige", hex: "#cbb894" }, { name: "Noir", hex: "#151515" }] },
  { id: "fb-4", name: "D3 2001 Platform", brand: "Osiris", category: "Chaussures", price: 8900, originalPrice: 10500, material: "Cuir synthétique", sku: "CP-OS-D3", tag: "Skate", sizes: [{ size: "39", stock: 1 }, { size: "40", stock: 4 }, { size: "41", stock: 4 }, { size: "42", stock: 0 }, { size: "43", stock: 3 }], colors: [{ name: "Vert Militaire", hex: "#3d4a30" }, { name: "Noir", hex: "#111111" }] },
  { id: "fb-5", name: "Air Retro Court", brand: "Jordan", category: "Chaussures", price: 19500, originalPrice: 23000, material: "Cuir premium", sku: "CP-JD-ARC", tag: "Hype", sizes: [{ size: "40", stock: 0 }, { size: "41", stock: 2 }, { size: "42", stock: 2 }, { size: "43", stock: 1 }, { size: "44", stock: 0 }], colors: [{ name: "Rouge/Noir", hex: "#a12020" }] },
  { id: "fb-6", name: "Oversized Hoodie", brand: "CopIt Basics", category: "Vêtements", price: 4500, originalPrice: 5500, material: "Coton molletonné 320g", sku: "CP-BS-HD1", tag: "Essentiel", sizes: [{ size: "S", stock: 8 }, { size: "M", stock: 10 }, { size: "L", stock: 6 }, { size: "XL", stock: 2 }], colors: [{ name: "Noir", hex: "#111111" }, { name: "Sable", hex: "#c9b89a" }] },
  { id: "fb-7", name: "Cargo Tech Pants", brand: "CopIt Basics", category: "Vêtements", price: 5200, originalPrice: 6200, material: "Ripstop", sku: "CP-BS-CG1", tag: "Nouveau", sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 7 }, { size: "L", stock: 5 }, { size: "XL", stock: 0 }], colors: [{ name: "Kaki", hex: "#5c5b45" }, { name: "Noir", hex: "#151515" }] },
  { id: "fb-8", name: "Bucket Hat Signature", brand: "CopIt Basics", category: "Accessoires", price: 1800, originalPrice: 2200, material: "Coton canvas", sku: "CP-BS-BK1", tag: "", sizes: [{ size: "Unique", stock: 12 }], colors: [{ name: "Noir", hex: "#111111" }, { name: "Orange", hex: "#ff4b1f" }] },
];

export interface FallbackOrder {
  id: string;
  name: string;
  phone: string;
  wilaya: string;
  status: string;
  total: number;
  createdAt: string;
  procolisId: string | null;
  items: { productName: string; brand: string; size: string; color: string; quantity: number; price: number }[];
}

export const FALLBACK_ORDERS: FallbackOrder[] = [
  {
    id: "CP-DEMO-001",
    name: "Mohamed Alilouche",
    phone: "0551234567",
    wilaya: "Alger",
    status: "shipped",
    total: 16500,
    createdAt: new Date("2026-07-10T14:30:00").toISOString(),
    procolisId: "ZRE-2026-07-10-001",
    items: [{ productName: "1460 Smooth Leather Boots", brand: "Dr. Martens", size: "42", color: "Noir", quantity: 1, price: 16500 }],
  },
  {
    id: "CP-DEMO-002",
    name: "Sarah Bensalem",
    phone: "0551234567",
    wilaya: "Oran",
    status: "processing",
    total: 9700,
    createdAt: new Date("2026-07-12T09:15:00").toISOString(),
    procolisId: null,
    items: [
      { productName: "Oversized Hoodie", brand: "CopIt Basics", size: "M", color: "Noir", quantity: 1, price: 4500 },
      { productName: "Bucket Hat Signature", brand: "CopIt Basics", size: "Unique", color: "Noir", quantity: 1, price: 1800 },
    ],
  },
  {
    id: "CP-DEMO-003",
    name: "Yanis Kerrouche",
    phone: "0669876543",
    wilaya: "Constantine",
    status: "delivered",
    total: 5200,
    createdAt: new Date("2026-07-01T16:45:00").toISOString(),
    procolisId: "ZRE-2026-07-01-003",
    items: [{ productName: "Cargo Tech Pants", brand: "CopIt Basics", size: "L", color: "Kaki", quantity: 1, price: 5200 }],
  },
];

export const FALLBACK_SHIPPING: { wilaya: string; homePrice: number; stopPrice: number; days: string }[] = [
  { wilaya: "Alger", homePrice: 400, stopPrice: 250, days: "24-48h" },
  { wilaya: "Blida", homePrice: 400, stopPrice: 250, days: "24-48h" },
  { wilaya: "Oran", homePrice: 650, stopPrice: 450, days: "2-4 jours" },
  { wilaya: "Constantine", homePrice: 650, stopPrice: 450, days: "2-4 jours" },
  { wilaya: "Béjaïa", homePrice: 650, stopPrice: 450, days: "2-4 jours" },
  { wilaya: "Tizi Ouzou", homePrice: 650, stopPrice: 450, days: "2-4 jours" },
  { wilaya: "Sétif", homePrice: 650, stopPrice: 450, days: "2-4 jours" },
  { wilaya: "Annaba", homePrice: 650, stopPrice: 450, days: "2-4 jours" },
];

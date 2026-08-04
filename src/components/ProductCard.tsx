"use client";

import { memo, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { optimizeCldUrl } from "@/lib/cloudinary";

export interface ProductData {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  material: string;
  sku: string;
  tag?: string | null;
  position?: number;
  featured?: boolean;
  showOnHomepage?: boolean;
  showInLatestSneakers?: boolean;
  showInMenu?: boolean;
  showInBrandSection?: boolean;
  variants: { id: string; size: string; color: string; colorHex: string; stock: number }[];
  images: { id: string; url: string; alt?: string | null }[];
}

function money(n: number) {
  return n.toLocaleString("fr-FR") + " DA";
}

function ProductIcon({ category }: { category: string }) {
  if (category === "Vêtements") {
    return (
      <svg viewBox="0 0 100 100" width="55%" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M35 15L20 25v15h8v45h44V40h8V25L65 15l-6 6a12 12 0 01-18 0z" />
      </svg>
    );
  }
  if (category === "Accessoires") {
    return (
      <svg viewBox="0 0 100 100" width="50%" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="50" cy="35" rx="34" ry="14" />
        <path d="M20 35c0 20 6 40 30 40s30-20 30-40" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 130" width="70%" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M10 95c0-8 8-14 18-16 12-2 20-10 30-14 14-6 30-6 42 2 6 4 10 4 18 2 14-4 30 0 42 10 8 6 12 8 20 8 6 0 8 4 8 8v8c0 4-3 7-7 7H17c-4 0-7-3-7-7v-8z" />
      <path d="M40 95v-10M60 95v-14M85 95v-16" strokeDasharray="2 3" />
    </svg>
  );
}

export default memo(function ProductCard({ product, onClick }: { product: ProductData; onClick: () => void }) {
  const { t } = useLang();
  const [imgErr, setImgErr] = useState(false);
  const img = product.images?.[0]?.url;

  return (
    <div className="pcard">
      <div className="pcard-img" onClick={onClick} style={{ cursor: "pointer" }}>
        {product.featured && <span className="badge pcard-featured">★</span>}
        {product.tag && <span className="badge pcard-tag">{product.tag}</span>}
        {img && !imgErr ? (
          <img src={optimizeCldUrl(img, { w: 400 })} alt={product.name} loading="lazy" onError={() => setImgErr(true)} />
        ) : (
          <ProductIcon category={product.category} />
        )}
      </div>
      <div className="pcard-body">
        <div className="pcard-brand">{product.brand}</div>
        <div className="pcard-name">{product.name}</div>
        <div className="pcard-price">
          <span className="now">{money(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="was">{money(product.originalPrice)}</span>
          )}
        </div>
        <div className="pcard-atc">
          <button onClick={onClick}>{t("add_to_cart")}</button>
        </div>
      </div>
    </div>
  );
});

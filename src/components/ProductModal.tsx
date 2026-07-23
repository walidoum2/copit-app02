"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LangContext";
import type { ProductData } from "./ProductCard";

const PALETTE: Record<string, [string, string]> = {
  "CP-DM-1460": ["#e8ddd6", "#d4c9bf"],
  "CP-UA-HP3": ["#d6d9de", "#c4c7cc"],
  "CP-PM-LFR": ["#e0e0e6", "#ceced4"],
  "CP-OS-D3": ["#d8dfd8", "#c6cdc6"],
  "CP-JD-ARC": ["#e3d0d0", "#d4bebe"],
  "CP-BS-HD1": ["#dcdcde", "#cacacc"],
  "CP-BS-CG1": ["#dadcd6", "#c8cac4"],
  "CP-BS-BK1": ["#ddd5ce", "#ccc4bc"],
};

function money(n: number) { return n.toLocaleString("fr-FR") + " DA"; }

export default function ProductModal({
  product, show, onClose, onToast
}: {
  product: ProductData | null;
  show: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}) {
  const { addItem } = useCart();
  const { t } = useLang();
  const [selSize, setSelSize] = useState<string | null>(null);
  const [selColor, setSelColor] = useState(0);

  if (!product) return null;

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const totalStock = product.variants.reduce((a, v) => a + v.stock, 0);
  const [sw1, sw2] = PALETTE[product.sku] || ["#f0f0ec", "#e4e4df"];
  const mainImg = product.images?.[0]?.url;

  function getStock(size: string, color: string) {
    const v = product!.variants.find((vv) => vv.size === size && vv.color === color);
    return v?.stock || 0;
  }

  function handleAdd() {
    if (!selSize) {
      onToast(t("select_size") + "!");
      return;
    }
    const variant = product!.variants.find(
      (v) => v.size === selSize && v.color === colors[selColor]
    );
    if (!variant || variant.stock === 0) return;

    addItem({
      id: product!.id,
      variantId: variant.id,
      name: product!.name,
      brand: product!.brand,
      price: product!.price,
      size: variant.size,
      color: variant.color,
      colorHex: variant.colorHex,
    });
    onToast(t("add_to_cart") + "!");
    onClose();
  }

  return (
    <div className={`pmodal-overlay ${show ? "show" : ""}`} onClick={onClose}>
      <div className="pmodal-inner" onClick={(e) => e.stopPropagation()}>
        <button className="pmodal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div className="pmodal-grid">
          <div className="pmodal-img" style={mainImg ? {} : { "--sw1": sw1, "--sw2": sw2 } as React.CSSProperties}>
            {mainImg ? (
              <img src={mainImg} alt={product!.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg viewBox="0 0 200 130" width="52%" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M10 95c0-8 8-14 18-16 12-2 20-10 30-14 14-6 30-6 42 2 6 4 10 4 18 2 14-4 30 0 42 10 8 6 12 8 20 8 6 0 8 4 8 8v8c0 4-3 7-7 7H17c-4 0-7-3-7-7v-8z" />
              </svg>
            )}
          </div>
          <div className="pmodal-info">
            <div className="pmodal-brand">{product!.brand} · <span className="mono" style={{ color: "var(--steel)" }}>{product!.sku}</span></div>
            <h2 className="display" style={{ fontSize: 28 }}>{product!.name}</h2>
            <div className="pmodal-price">
              <span className="now">{money(product!.price)}</span>
              {product!.originalPrice > product!.price && <span className="was">{money(product!.originalPrice)}</span>}
            </div>
            <div className="pmodal-stock">
              <span className="dot" />
              <span>{totalStock} {t("in_stock")}</span>
            </div>

            <div className="opt-label">{t("select_size")}</div>
            <div className="size-row">
              {sizes.map((s) => {
                const st = getStock(s, colors[selColor]);
                return (
                  <button
                    key={s}
                    className={`size-chip ${selSize === s ? "sel" : ""} ${st === 0 ? "oos" : ""} ${st > 0 && st <= 2 ? "low" : ""}`}
                    onClick={() => setSelSize(s)}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="opt-label">{t("select_color")}</div>
            <div className="color-row">
              {colors.map((c, i) => (
                <div
                  key={c}
                  className={`color-chip ${i === selColor ? "sel" : ""}`}
                  style={{ background: product!.variants.find((v) => v.color === c)?.colorHex || "#888" }}
                  onClick={() => { setSelColor(i); setSelSize(null); }}
                />
              ))}
            </div>

            <div className="pmodal-cta">
              <button className="btn btn-primary btn-block" onClick={handleAdd}>{t("add_to_cart")}</button>
            </div>

            <div className="spec-list">
              <div className="spec-row"><span>{t("material_lbl")}</span><span>{product!.material}</span></div>
              <div className="spec-row"><span>Catégorie</span><span>{product!.category}</span></div>
              <div className="spec-row"><span>Garantie</span><span>Original garanti</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

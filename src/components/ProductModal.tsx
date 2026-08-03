"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LangContext";
import type { ProductData } from "./ProductCard";

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
  const [imgIdx, setImgIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOff, setDragOff] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lenRef = useRef(0);
  const dragStartRef = useRef<{ x: number; idx: number } | null>(null);
  const dragOffRef = useRef(0);
  const movedRef = useRef(false);

  const images = product?.images || [];

  useEffect(() => {
    if (!product) return;
    setImgIdx(0);
    setSelSize(null);
    setSelColor(0);
    setZoomed(false);
  }, [product?.id]);

  useEffect(() => {
    lenRef.current = images.length;
    if (!product || images.length < 2 || paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setImgIdx(prev => (prev + 1) % lenRef.current);
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [product, images.length, paused]);

  if (!product) return null;

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const totalStock = product.variants.reduce((a, v) => a + v.stock, 0);

  function nextImg() { setImgIdx(prev => (prev + 1) % images.length); }
  function prevImg() { setImgIdx(prev => (prev - 1 + images.length) % images.length); }

  function startDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (images.length === 0) return;
    dragStartRef.current = { x: e.clientX, idx: imgIdx };
    dragOffRef.current = 0;
    movedRef.current = false;
    setDragging(true);
    setPaused(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function moveDrag(e: React.PointerEvent<HTMLDivElement>) {
    const s = dragStartRef.current;
    if (!s || images.length < 2) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 6) movedRef.current = true;
    dragOffRef.current = dx;
    setDragOff(dx);
  }
  function endDrag() {
    const s = dragStartRef.current;
    if (!s) return;
    dragStartRef.current = null;
    setDragging(false);
    setPaused(false);
    const dx = dragOffRef.current;
    setDragOff(0);
    if (images.length < 2) {
      setZoomed(z => !z);
      return;
    }
    if (Math.abs(dx) > 60) {
      if (dx < 0) nextImg();
      else prevImg();
    } else if (!movedRef.current) {
      setZoomed(z => !z);
    }
  }
  function onStageKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") { e.preventDefault(); nextImg(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prevImg(); }
    else if (e.key === "Escape") onClose();
  }

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
        <button className="pmodal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div className="pmodal-grid">
          <div className={`pmodal-img${zoomed ? " zoomed" : ""}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {images.length > 0 ? (
              <>
                <div
                  className={`gal-stage${dragging ? " dragging" : ""}`}
                  tabIndex={0}
                  role="region"
                  aria-label={product!.name}
                  onPointerDown={startDrag}
                  onPointerMove={moveDrag}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onKeyDown={onStageKey}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div className="gal-track" style={{ transform: `translateX(${dragOff - imgIdx * 100}%)` }}>
                    {images.map((img, i) => (
                      <img key={i} src={img.url} alt={product!.name} className={`gal-slide${i === imgIdx ? " active" : ""}`} loading="lazy" draggable={false} />
                    ))}
                  </div>
                </div>
                {images.length > 1 && (
                  <>
                    <button className="gal-arrow gal-arrow-left" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); prevImg(); }} aria-label="Previous">‹</button>
                    <button className="gal-arrow gal-arrow-right" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); nextImg(); }} aria-label="Next">›</button>
                    <div className="gal-dots" onPointerDown={(e) => e.stopPropagation()}>
                      {images.map((_, i) => (
                        <span key={i} className={`gal-dot${i === imgIdx ? " active" : ""}`} onClick={(e) => { e.stopPropagation(); setImgIdx(i); }} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <svg viewBox="0 0 200 130" width="52%" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M10 95c0-8 8-14 18-16 12-2 20-10 30-14 14-6 30-6 42 2 6 4 10 4 18 2 14-4 30 0 42 10 8 6 12 8 20 8 6 0 8 4 8 8v8c0 4-3 7-7 7H17c-4 0-7-3-7-7v-8z" />
              </svg>
            )}
          </div>
          <div className="pmodal-info">
            <div className="pmodal-brand">{product!.brand} · <span className="mono" style={{ color: "var(--steel)" }}>{product!.sku}</span></div>
            <h2>{product!.name}</h2>
            <div className="pmodal-price">
              <span className="now">{money(product!.price)}</span>
              {product!.originalPrice > product!.price && <span className="was">{money(product!.originalPrice)}</span>}
            </div>
            <div className="pmodal-stock">
              <span className="dot" style={{ background: totalStock > 0 ? "var(--cop)" : "var(--steel)" }} />
              <span>{totalStock > 0 ? `${totalStock} ${t("in_stock")}` : t("out_of_stock")}</span>
            </div>

            {colors.length > 1 && (
              <>
                <div className="opt-label">{t("select_color")}</div>
                <div className="color-row">
                  {colors.map((c, i) => (
                    <button
                      key={c}
                      className={`color-chip ${i === selColor ? "sel" : ""}`}
                      style={{ background: product!.variants.find((v) => v.color === c)?.colorHex || "#888" }}
                      onClick={() => { setSelColor(i); setSelSize(null); }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="opt-label">{t("select_size")}</div>
            <div className="size-row">
              {sizes.map((s) => {
                const st = getStock(s, colors[selColor]);
                return (
                  <button
                    key={s}
                    className={`size-chip ${selSize === s ? "sel" : ""} ${st === 0 ? "oos" : ""}`}
                    onClick={() => setSelSize(s)}
                    disabled={st === 0}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="pmodal-cta">
              <button className="btn btn-primary btn-block" onClick={handleAdd} disabled={totalStock === 0}>{t("add_to_cart")}</button>
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

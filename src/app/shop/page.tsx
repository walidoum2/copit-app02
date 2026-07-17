"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import ProductCard, { type ProductData } from "@/components/ProductCard";
import { useLang } from "@/contexts/LangContext";

function ShopContent() {
  const { t } = useLang();
  const params = useSearchParams();
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const category = params.get("category") || "";
  const promo = params.get("promo") === "true";

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({ page: String(page), limit: "12" });
    if (category) q.set("category", category);
    if (promo) q.set("promo", "true");
    fetch(`/api/products?${q}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setTotalPages(d.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, category, promo]);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2600);
  }

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer show={cartOpen} onClose={() => setCartOpen(false)} />
      <ProductModal
        product={selectedProduct}
        show={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToast={showToast}
      />

      <div className="wrap page-head">
        <h1 className="display">{promo ? t("promo_title") : t("shop_title")}</h1>
        {promo && <p style={{ color: "var(--steel)", marginTop: 6 }}>{t("promo_sub")}</p>}
      </div>
      <div className="wrap" style={{ padding: "36px 0 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}><div className="spinner" /></div>
        ) : (
          <>
            <div className="grid-products">
              {products.length === 0 ? (
                <p style={{ color: "var(--steel)", fontSize: 13, gridColumn: "1 / -1", textAlign: "center", padding: 60 }}>{t("shop_empty")}</p>
              ) : (
                products.map((p) => (
                  <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
                ))
              )}
            </div>
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
                <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
                <span className="mono" style={{ padding: "10px 16px", fontSize: 13 }}>Page {page} / {totalPages}</span>
                <button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />

      <div className={`toast ${toastMsg ? "show" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        <span>{toastMsg}</span>
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 80 }}><div className="spinner" /></div>}>
      <ShopContent />
    </Suspense>
  );
}

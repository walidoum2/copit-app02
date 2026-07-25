"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import ProductCard, { type ProductData } from "@/components/ProductCard";
import { useLang } from "@/contexts/LangContext";

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function BannerTile({ title, subtitle, linkUrl, imageUrl }: { title: string; subtitle: string; linkUrl: string; imageUrl?: string }) {
  return (
    <a href={linkUrl} className="banner-tile" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}>
      <div className="banner-tile-overlay" />
      <div className="banner-tile-content">
        <h2 className="banner-tile-title">{title}</h2>
        <span className="banner-tile-cta">{subtitle}</span>
      </div>
    </a>
  );
}

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [productsError, setProductsError] = useState(false);
  const [landingSettings, setLandingSettings] = useState<Record<string, string>>({});
  const { t, lang } = useLang();

  function api(url: string) { return fetch(url + (url.includes("?") ? "&" : "?") + "_t=" + Date.now()).then(r => r.json()); }

  useEffect(() => {
    api("/api/products?limit=8")
      .then((d) => {
        if (d.products) setProducts(d.products);
        else setProductsError(true);
      })
      .catch(() => setProductsError(true));
    api("/api/landing")
      .then((d) => { if (d.settings) setLandingSettings(d.settings); })
      .catch(() => {});
  }, []);

  useScrollReveal();

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2600);
  }

  const sortedProducts = [...products].sort((a, b) => (a.position || 0) - (b.position || 0)).slice(0, 8);

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

      <div className="banner-tiles">
        <BannerTile
          title={lang === "ar" ? "أحذية" : "CHAUSSURES"}
          subtitle={lang === "ar" ? "تسوق ←" : "LE SHOP →"}
          linkUrl="/shop?category=Chaussures"
          imageUrl={landingSettings["banner_chaussures_img"]}
        />
        <BannerTile
          title={t("promo_title")}
          subtitle={t("promo_btn")}
          linkUrl="/shop?promo=true"
          imageUrl={landingSettings["banner_promo_img"]}
        />
      </div>

      <section className="wrap" data-reveal>
        <div className="section-head">
          <div><h2 className="text-heading">{t("new_title")}</h2></div>
          <a href="/shop" className="btn btn-outline btn-sm">{t("see_all")}</a>
        </div>
        <div className="grid-products cols-2">
          {productsError ? (
            <p style={{ color: "var(--steel)", fontSize: 13, gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>{t("home_products_error")}</p>
          ) : (
            sortedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
            ))
          )}
        </div>
      </section>

      <Footer />

      <div className={`toast ${toastMsg ? "show" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        <span>{toastMsg}</span>
      </div>
    </>
  );
}

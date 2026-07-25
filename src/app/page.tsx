"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import ProductCard, { type ProductData } from "@/components/ProductCard";
import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import { FAQ_DATA } from "@/data/dictionary";
import { optimizeCldUrl } from "@/lib/cloudinary";

function money(n: number) { return n.toLocaleString("fr-FR") + " DA"; }

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

interface CatItem { nameFr: string; nameAr: string; nameEn: string; slug: string; imageUrl?: string; }

function Categories({ categories: dbCats, lang, t }: { categories: CatItem[]; lang: string; t: (k: string) => string }) {
  const nameKey = lang === "ar" ? "nameAr" : lang === "en" ? "nameEn" : "nameFr" as keyof CatItem;
  const cats = dbCats.length > 0 ? dbCats : [
    { nameFr: "Sneakers", nameAr: "سنيكرز", nameEn: "Sneakers", slug: "Chaussures" },
    { nameFr: "Vêtements", nameAr: "ملابس", nameEn: "Clothing", slug: "Vêtements" },
    { nameFr: "Accessoires", nameAr: "إكسسوارات", nameEn: "Accessories", slug: "Accessoires" },
  ] as CatItem[];
  const topTwo = cats.slice(0, 2);
  const bottom = cats.slice(2);
  return (
    <section className="wrap" data-reveal>
      <div className="section-head-alt">
        <h2>{t("cat_title")}</h2>
      </div>
      <div className="cat-grid-premium">
        <div className="cat-row-top">
          {topTwo.map((cat) => (
            <a key={cat.slug} href={`/shop?category=${encodeURIComponent(cat.slug)}`} className="cat-card-premium">
              {cat.imageUrl ? (
                <div className="cat-premium-img-wrap">
                  <img src={optimizeCldUrl(cat.imageUrl, { w: 600 })} alt="" className="cat-premium-img" loading="lazy" />
                  <div className="cat-premium-overlay" />
                </div>
              ) : (
                <div className="cat-premium-placeholder">
                  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 40, height: 40, opacity: 0.3 }}>
                    <rect x="8" y="16" width="64" height="48" rx="4" />
                    <circle cx="30" cy="36" r="8" />
                    <path d="M8 54l18-14 14 12 12-10 20 16" />
                  </svg>
                </div>
              )}
              <div className="cat-premium-content">
                <h3>{cat[nameKey]}</h3>
                <span className="cat-premium-cta">LE SHOP →</span>
              </div>
            </a>
          ))}
        </div>
        {bottom.length > 0 && (
          <div className="cat-row-bottom">
            {bottom.map((cat) => (
              <a key={cat.slug} href={`/shop?category=${encodeURIComponent(cat.slug)}`} className="cat-card-premium wide">
                {cat.imageUrl ? (
                  <div className="cat-premium-img-wrap">
                    <img src={optimizeCldUrl(cat.imageUrl, { w: 800 })} alt="" className="cat-premium-img" loading="lazy" />
                    <div className="cat-premium-overlay" />
                  </div>
                ) : (
                  <div className="cat-premium-placeholder">
                    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 40, height: 40, opacity: 0.3 }}>
                      <rect x="8" y="16" width="64" height="48" rx="4" />
                      <circle cx="30" cy="36" r="8" />
                      <path d="M8 54l18-14 14 12 12-10 20 16" />
                    </svg>
                  </div>
                )}
                <div className="cat-premium-content">
                  <h3>{cat[nameKey]}</h3>
                  <span className="cat-premium-cta">LE SHOP →</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function WhyIcon({ name, size = 24 }: { name: string; size?: number }) {
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", style: { width: size, height: size } } as const;
  switch (name) {
    case "check": return <svg {...props}><path d="M20 6L9 17l-5-5" /></svg>;
    case "truck": return <svg {...props}><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    case "map": return <svg {...props}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    case "refresh": return <svg {...props}><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>;
    default: return <svg {...props}><path d="M20 6L9 17l-5-5" /></svg>;
  }
}

interface WhyItem { icon: string; imageUrl?: string; headingFr: string; headingAr: string; headingEn: string; paragraphFr: string; paragraphAr: string; paragraphEn: string; }

function WhyUs({ items: dbItems, lang, t }: { items: WhyItem[]; lang: string; t: (k: string) => string }) {
  const fallback: WhyItem[] = [
    { icon: "check", headingFr: "Original Garanti", headingAr: "أصلي مضمون", headingEn: "Authentic Guaranteed", paragraphFr: "Tous nos produits sont 100% authentiques.", paragraphAr: "جميع منتجاتنا أصلية 100%", paragraphEn: "All products 100% authentic" },
    { icon: "truck", headingFr: "Livraison 69 Wilayas", headingAr: "توصيل 69 ولاية", headingEn: "69 Wilayas Covered", paragraphFr: "Livraison rapide dans toute l'Algérie.", paragraphAr: "توصيل سريع في جميع أنحاء الجزائر", paragraphEn: "Fast delivery across Algeria" },
    { icon: "map", headingFr: "Paiement à la Livraison", headingAr: "الدفع عند الاستلام", headingEn: "Cash on Delivery", paragraphFr: "Payez uniquement à la réception.", paragraphAr: "ادفع فقط عند الاستلام", paragraphEn: "Pay only when you receive" },
    { icon: "refresh", headingFr: "Échange Facile", headingAr: "تبديل سهل", headingEn: "Easy Exchange", paragraphFr: "Satisfait ou échangé sous 7 jours.", paragraphAr: "استبدال خلال 7 أيام", paragraphEn: "Exchange within 7 days" },
  ];
  const items = dbItems.length > 0 ? dbItems : fallback;
  const hKey = lang === "ar" ? "headingAr" : lang === "en" ? "headingEn" : "headingFr" as keyof WhyItem;
  const pKey = lang === "ar" ? "paragraphAr" : lang === "en" ? "paragraphEn" : "paragraphFr" as keyof WhyItem;
  return (
    <section className="wrap" data-reveal>
      <div className="section-head-alt">
        <h2>{t("why_title")}</h2>
      </div>
      <div className="why-grid-premium">
        {items.map((item, i) => (
          <div key={i} className="why-card-premium">
            {i === 0 && <div className="why-auth-premium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              <span>{lang === "ar" ? "أصلي مضمون" : "AUTHENTICITÉ VÉRIFIÉE"}</span>
            </div>}
            <WhyIcon name={item.icon} size={24} />
            <h4>{item[hKey]}</h4>
            <p>{item[pKey]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface FaqEntry { questionFr: string; questionAr: string; questionEn: string; answerFr: string; answerAr: string; answerEn: string; }

function FAQSection({ faqs: dbFaqs, lang, t }: { faqs: FaqEntry[]; lang: string; t: (k: string) => string }) {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = dbFaqs.length > 0 ? dbFaqs : (FAQ_DATA[lang === "ar" ? "ar" : "fr"] || FAQ_DATA.fr).map(f => ({ questionFr: f.q, questionAr: f.q, questionEn: f.q, answerFr: f.a, answerAr: f.a, answerEn: f.a }));
  const qKey = lang === "ar" ? "questionAr" : lang === "en" ? "questionEn" : "questionFr" as keyof FaqEntry;
  const aKey = lang === "ar" ? "answerAr" : lang === "en" ? "answerEn" : "answerFr" as keyof FaqEntry;
  return (
    <section className="wrap" id="faq" data-reveal>
      <div className="section-head-alt">
        <h2>{t("faq_title")}</h2>
      </div>
      <div className="faq-list-premium">
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item-premium ${i === openIdx ? "open" : ""}`}>
            <div className="faq-q-premium" onClick={() => setOpenIdx(i === openIdx ? -1 : i)}>
              <span>{f[qKey]}</span>
              <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, flexShrink: 0 }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <div className="faq-a-premium"><p>{f[aKey]}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [productsError, setProductsError] = useState(false);
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [whyus, setWhyus] = useState<WhyItem[]>([]);
  const [categories, setCategories] = useState<CatItem[]>([]);
  const [landingSettings, setLandingSettings] = useState<Record<string, string>>({});
  const { t, lang } = useLang();
  const { count } = useCart();

  const L = (key: string, fallback: string) => landingSettings[key] || fallback;

  function api(url: string) { return fetch(url + (url.includes("?") ? "&" : "?") + "_t=" + Date.now()).then(r => r.json()); }

  useEffect(() => {
    api("/api/products?limit=4")
      .then((d) => {
        if (d.products) setProducts(d.products);
        else setProductsError(true);
      })
      .catch(() => setProductsError(true));
    Promise.all([
      api("/api/content?type=faq"),
      api("/api/content?type=whyus"),
      api("/api/content?type=categories"),
      api("/api/landing"),
    ]).then(([faqD, whyD, catD, landD]) => {
      if (faqD.faqs?.length) setFaqs(faqD.faqs);
      if (whyD.items?.length) setWhyus(whyD.items);
      if (catD.categories?.length) setCategories(catD.categories);
      if (landD.settings) setLandingSettings(landD.settings);
    }).catch(() => {});
  }, []);

  useScrollReveal();

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2600);
  }

  const sortedProducts = [...products].sort((a, b) => (a.position || 0) - (b.position || 0)).slice(0, 4);

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

      <div className="promo-bar">
        <span>🔥 {lang === "ar" ? "توصيل مجاني للطلبيات فوق 15000 دج" : "LIVRAISON OFFERTE DÈS 15 000 DA"} 🔥</span>
      </div>

      <section className="hero-premium">
        <div className="wrap">
          <h1 className="hero-premium-title">
            <span className="hero-line">LIKE IT.</span>
            <span className="hero-line">WANT IT.</span>
            <span className="hero-line hero-line-highlight">COP IT.</span>
          </h1>
          <p className="hero-premium-sub">{lang === "ar" ? "سنيكرز وستريتوير أصلية 100%" : "SNEAKERS & STREETWEAR 100% ORIGINAUX"}</p>
          <div className="hero-premium-actions">
            <a href="/shop" className="btn-premium-primary">{t("hero_cta1")}</a>
            <a href="/shop?promo=true" className="btn-premium-secondary">★ {t("promo_btn")}</a>
          </div>
        </div>
      </section>

      <Categories categories={categories} lang={lang} t={t} />

      <section className="product-section-premium" data-reveal>
        <div className="wrap">
          <div className="section-head-alt">
            <h2>{t("new_title")}</h2>
            <a href="/shop" className="btn-premium-outline">{t("see_all")}</a>
          </div>
          <div className="grid-products-premium">
            {productsError ? (
              <p style={{ color: "var(--text-dim)", fontSize: 13, gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>{t("home_products_error")}</p>
            ) : (
              sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
              ))
            )}
          </div>
        </div>
      </section>

      <div className="hz-divider" />

      <WhyUs items={whyus} lang={lang} t={t} />

      <FAQSection faqs={faqs} lang={lang} t={t} />

      <Footer />

      <button className="floating-cart" onClick={() => setCartOpen(true)} aria-label="Cart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
        {count > 0 && <span className="floating-cart-badge">{count}</span>}
      </button>

      <div className={`toast ${toastMsg ? "show" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        <span>{toastMsg}</span>
      </div>
    </>
  );
}

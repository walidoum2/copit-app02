"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import ProductCard, { type ProductData } from "@/components/ProductCard";
import { useLang } from "@/contexts/LangContext";
import { FAQ_DATA } from "@/data/dictionary";
import { optimizeCldUrl } from "@/lib/cloudinary";

function money(n: number) { return n.toLocaleString("fr-FR") + " DA"; }

function HeroSection({ settings }: { settings: Record<string, string> }) {
  const { t } = useLang();
  const S = (key: string, fallback: string) => settings[key] || fallback;
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="hero-eyebrow">{S("hero_eyebrow", "DROP EN COURS — 69 WILAYAS")}</div>
          <h1 className="hero-title">{S("hero_title", "LIKE IT. WANT IT. COP IT.")}</h1>
          <p className="hero-body">{t("hero_policy")}</p>
          <div className="hero-actions">
            <a href="/shop?promo=true" className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              {t("promo_btn")}
            </a>
            <a href="/shop" className="btn btn-outline">{t("hero_cta1")}</a>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg><span>{t("badge1")}</span></div>
            <div className="hero-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg><span>{t("badge2")}</span></div>
            <div className="hero-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg><span>{t("badge3")}</span></div>
          </div>
        </div>
        <div className="hero-visual">
          {S("hero_visual_img", "") ? (
            <img src={optimizeCldUrl(S("hero_visual_img", ""), { w: 800 })} alt="" fetchPriority="high" loading="eager" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <svg viewBox="0 0 200 130" width="72%" fill="none" stroke="#E8E8E4" strokeWidth="1.4">
              <path d="M10 95c0-8 8-14 18-16 12-2 20-10 30-14 14-6 30-6 42 2 6 4 10 4 18 2 14-4 30 0 42 10 8 6 12 8 20 8 6 0 8 4 8 8v8c0 4-3 7-7 7H17c-4 0-7-3-7-7v-8z" />
              <path d="M40 95v-10M60 95v-14M85 95v-16" strokeDasharray="2 3" />
            </svg>
          )}
          <div className="hero-visual-caption">
            <div>
              <div className="text-label" style={{ fontSize: 10, color: "var(--cop-dim)" }}>{S("hero_visual_sku", "SKU // CP-0192")}</div>
              <div className="hero-visual-title">{S("hero_visual_title", "New Arrival")}</div>
            </div>
            <div className="hero-visual-stat">{S("hero_visual_stat", "28K+")}<br /><span className="hero-visual-stat-label">{S("hero_visual_stat_label", "COPPERS")}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FALLBACK_BRANDS = ["Dr. Martens", "Under Armour", "Puma", "Osiris", "Jordan", "CopIt Basics"];

function Marquee({ brands: dbBrands }: { brands: { name: string; hot: boolean }[] }) {
  const brands = dbBrands.length > 0 ? dbBrands : FALLBACK_BRANDS.map(n => ({ name: n, hot: false }));
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1].map((i) =>
          brands.map((b, idx) => (
            <span key={`${i}-${idx}`} className={b.hot ? "hot" : ""}>
              {b.name} <span style={{ color: "var(--cop)" }}>✕ </span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}

interface CatItem { nameFr: string; nameAr: string; nameEn: string; slug: string; imageUrl?: string; }

function Categories({ categories: dbCats, lang, t }: { categories: CatItem[]; lang: string; t: (k: string) => string }) {
  const cats = dbCats.length > 0 ? dbCats : [{ nameFr: "Chaussures", nameAr: "أحذية", nameEn: "Shoes", slug: "Chaussures" },{ nameFr: "Vêtements", nameAr: "ملابس", nameEn: "Clothing", slug: "Vêtements" },{ nameFr: "Accessoires", nameAr: "إكسسوارات", nameEn: "Accessories", slug: "Accessoires" }];
  const nameKey = lang === "ar" ? "nameAr" : lang === "en" ? "nameEn" : "nameFr" as keyof CatItem;
  return (
    <section className="wrap">
      <div className="section-head">
        <div><h2 className="text-heading">{t("cat_title")}</h2></div>
      </div>
      <div className="cat-grid">
        {cats.map((cat) => (
          <a key={cat.slug} href={`/shop?category=${encodeURIComponent(cat.slug)}`} className="cat-card">
            {cat.imageUrl ? (
              <>
                <img src={optimizeCldUrl(cat.imageUrl, { w: 400 })} alt="" loading="lazy" className="cat-card-img" />
                <div className="cat-card-overlay cat-card-img-overlay">
                  <h3>{cat[nameKey]}</h3>
                  <p>{t("shop_title")} →</p>
                </div>
              </>
            ) : (
              <div className="cat-card-overlay">
                <h3>{cat[nameKey]}</h3>
                <p>{t("shop_title")} →</p>
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

function SlideCarousel({ slide, speed = 3000 }: { slide: SlideItem; speed?: number }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  let images: string[] = [];
  try { images = JSON.parse(slide.imageUrls || "[]"); } catch {}

  function changeIdx(idx: number) {
    setPrevIdx(imgIdx);
    setImgIdx(idx);
    setTimeout(() => setPrevIdx(null), 500);
  }

  function next() { changeIdx((imgIdx + 1) % images.length); }
  function prev() { changeIdx((imgIdx - 1 + images.length) % images.length); }

  useEffect(() => {
    if (images.length <= 1 || paused || !slide.autoRotate) return;
    timerRef.current = setInterval(next, speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [slide.id, images.length, speed, paused, slide.autoRotate]);

  const imgStyle: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.5s ease" };

  return (
    <div className="slide-carousel"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {images.length > 0 ? (
        <>
          {prevIdx !== null && (
            <img key={`prev-${prevIdx}`} src={optimizeCldUrl(images[prevIdx], { w: 600 })} alt="" style={{ ...imgStyle, opacity: 0, zIndex: 1 }} />
          )}
          <img key={`cur-${imgIdx}`} src={optimizeCldUrl(images[imgIdx], { w: 600 })} alt={slide.title} loading="lazy" style={{ ...imgStyle, opacity: 1, zIndex: 2 }} />
        </>
      ) : (
        <div className="slide-empty">{slide.title}</div>
      )}
      {images.length > 1 && (
        <>
          <button onClick={prev} className="carousel-btn carousel-btn-left" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={next} className="carousel-btn carousel-btn-right" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </>
      )}
      <div className="slide-caption">
        <div className="slide-caption-title">{slide.title}</div>
        {slide.subtitle && <div className="slide-caption-sub">{slide.subtitle}</div>}
        {slide.price > 0 && (
          <div className="slide-caption-price">
            <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{money(slide.price)}</span>
            {slide.originalPrice > slide.price && (
              <span className="mono" style={{ fontSize: 11, opacity: 0.6, textDecoration: "line-through" }}>{money(slide.originalPrice)}</span>
            )}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="slide-dots">
          {images.map((_, idx) => (
            <button key={idx} onClick={() => setImgIdx(idx)} className={`slide-dot ${idx === imgIdx ? "active" : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SlideItem {
  id: string; title: string; subtitle: string; price: number; originalPrice: number;
  imageUrls: string; productId: string; linkUrl: string; autoRotate: boolean;
  rotationSpeed: number; active: boolean; position: number;
}

function SlidesSection({ slides, title, subtitle, seeAllLink = "/shop" }: { slides: SlideItem[]; title: string; subtitle: string; seeAllLink?: string }) {
  const { t } = useLang();
  if (!slides.length) return null;
  return (
    <section className="wrap">
      <div className="section-head">
        <div><h2 className="text-heading">{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        <a href={seeAllLink} className="btn btn-outline btn-sm">{t("see_all")}</a>
      </div>
      <div className={`slide-grid ${slides.length > 1 ? "cols-2" : "cols-1"}`}>
        {slides.map(s => (
          <a key={s.id} href={s.linkUrl || "/shop"} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
            <SlideCarousel slide={s} speed={s.rotationSpeed || 3000} />
          </a>
        ))}
      </div>
    </section>
  );
}

function WhyIcon({ name }: { name: string }) {
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", style: { width: 24, height: 24 } } as const;
  switch (name) {
    case "check": return <svg {...props}><path d="M20 6L9 17l-5-5" /></svg>;
    case "truck": return <svg {...props}><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    case "map": return <svg {...props}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    case "refresh": return <svg {...props}><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>;
    default: return <svg {...props}><path d="M20 6L9 17l-5-5" /></svg>;
  }
}

function WhyUs({ items: dbItems, lang, t }: { items: WhyItem[]; lang: string; t: (k: string) => string }) {
  const fallback = [
    { icon: "check", headingFr: t("why1_h"), headingAr: t("why1_h"), headingEn: t("why1_h"), paragraphFr: t("why1_p"), paragraphAr: t("why1_p"), paragraphEn: t("why1_p") },
    { icon: "truck", headingFr: t("why2_h"), headingAr: t("why2_h"), headingEn: t("why2_h"), paragraphFr: t("why2_p"), paragraphAr: t("why2_p"), paragraphEn: t("why2_p") },
    { icon: "map", headingFr: t("why3_h"), headingAr: t("why3_h"), headingEn: t("why3_h"), paragraphFr: t("why3_p"), paragraphAr: t("why3_p"), paragraphEn: t("why3_p") },
    { icon: "refresh", headingFr: t("why4_h"), headingAr: t("why4_h"), headingEn: t("why4_h"), paragraphFr: t("why4_p"), paragraphAr: t("why4_p"), paragraphEn: t("why4_p") },
  ];
  const items = dbItems.length > 0 ? dbItems : fallback;
  const hKey = lang === "ar" ? "headingAr" : lang === "en" ? "headingEn" : "headingFr" as keyof WhyItem;
  const pKey = lang === "ar" ? "paragraphAr" : lang === "en" ? "paragraphEn" : "paragraphFr" as keyof WhyItem;
  return (
    <section className="wrap">
      <div className="section-head"><div><h2 className="text-heading">{t("why_title")}</h2></div></div>
      <div className="why-grid">
        {items.map((item, i) => (
          <div key={i} className="why-item">
            <WhyIcon name={item.icon} />
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
    <section className="wrap" id="faq">
      <div className="section-head"><div><h2 className="text-heading">{t("faq_title")}</h2></div></div>
      <div>
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item ${i === openIdx ? "open" : ""}`}>
            <div className="faq-q" onClick={() => setOpenIdx(i === openIdx ? -1 : i)}>
              <span>{f[qKey]}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            </div>
            <div className="faq-a"><p>{f[aKey]}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface WhyItem { icon: string; headingFr: string; headingAr: string; headingEn: string; paragraphFr: string; paragraphAr: string; paragraphEn: string; }

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [productsError, setProductsError] = useState(false);
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [whyus, setWhyus] = useState<WhyItem[]>([]);
  const [brands, setBrands] = useState<{ name: string; hot: boolean }[]>([]);
  const [categories, setCategories] = useState<CatItem[]>([]);
  const [newArrivalSlides, setNewArrivalSlides] = useState<SlideItem[]>([]);
  const [promotionSlides, setPromotionSlides] = useState<SlideItem[]>([]);
  const [landingSettings, setLandingSettings] = useState<Record<string, string>>({});
  const { t, lang } = useLang();

  const L = (key: string, fallback: string) => landingSettings[key] || fallback;

  function api(url: string) { return fetch(url + (url.includes("?") ? "&" : "?") + "_t=" + Date.now()).then(r => r.json()); }

  useEffect(() => {
    api("/api/products?limit=8")
      .then((d) => {
        if (d.products) setProducts(d.products);
        else setProductsError(true);
      })
      .catch(() => setProductsError(true));
    Promise.all([
      api("/api/content?type=faq"),
      api("/api/content?type=whyus"),
      api("/api/content?type=brands"),
      api("/api/content?type=categories"),
      api("/api/slides?section=new_arrival"),
      api("/api/slides?section=promotion"),
      api("/api/landing"),
    ]).then(([faqD, whyD, brandD, catD, newD, promD, landD]) => {
      if (faqD.faqs?.length) setFaqs(faqD.faqs);
      if (whyD.items?.length) setWhyus(whyD.items);
      if (brandD.brands?.length) setBrands(brandD.brands);
      if (catD.categories?.length) setCategories(catD.categories);
      if (newD.slides?.length) setNewArrivalSlides(newD.slides);
      if (promD.slides?.length) setPromotionSlides(promD.slides);
      if (landD.settings) setLandingSettings(landD.settings);
    }).catch(() => {});
  }, []);

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

      <div className="promo-strip">
        <a href="/shop?promo=true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14, flexShrink: 0 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          <span>{L("promo_text", t("promo_btn"))}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12, flexShrink: 0 }}><path d="M5 12h14M13 18l6-6-6-6" /></svg>
        </a>
      </div>

      <HeroSection settings={landingSettings} />
      <Marquee brands={brands} />
      <Categories categories={categories} lang={lang} t={t} />

      {newArrivalSlides.length > 0 ? (
        <SlidesSection
          slides={newArrivalSlides}
          title={L("new_arrival_title", t("new_title"))}
          subtitle={L("new_arrival_subtitle", t("new_sub"))}
          seeAllLink="/shop"
        />
      ) : (
        <section className="wrap">
          <div className="section-head">
            <div><h2 className="text-heading">{t("new_title")}</h2><p>{t("new_sub")}</p></div>
            <a href="/shop" className="btn btn-outline btn-sm">{t("see_all")}</a>
          </div>
          <div className="grid-products">
            {productsError ? (
              <p style={{ color: "var(--steel)", fontSize: 13, gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>{t("home_products_error")}</p>
            ) : (
              [...products].sort((a, b) => (a.position || 0) - (b.position || 0)).slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
              ))
            )}
          </div>
        </section>
      )}

      <div className="hz-stripe" />

      {promotionSlides.length > 0 && (
        <SlidesSection
          slides={promotionSlides}
          title={L("promo_title", t("promo_title"))}
          subtitle={L("promo_subtitle", t("promo_sub"))}
          seeAllLink="/shop?promo=true"
        />
      )}

      <WhyUs items={whyus} lang={lang} t={t} />
      <FAQSection faqs={faqs} lang={lang} t={t} />

      <section className="wrap trust-section">
        <div className="trust-inner">
          <div className="trust-phone">
            <a href="tel:0562829805">0562 82 98 05</a>
          </div>
          <div className="trust-policy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 18, height: 18, color: "var(--cop-dim)", flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span>{t("hero_policy")}</span>
          </div>
        </div>
        <div className="social-bar">
          <a href="https://www.tiktok.com/@copit_dz" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="TikTok">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
          </a>
          <a href="https://www.instagram.com/copit_dz" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          </a>
          <a href="https://www.facebook.com/copit.2024/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </a>
          <a href="https://wa.me/213562829805" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm5.5 14.2c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.7 1.7.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.4.2.5.3.1.2.1.9-.2 1.5z" /></svg>
          </a>
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

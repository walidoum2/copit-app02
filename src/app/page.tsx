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

function HeroSection({ settings }: { settings: Record<string, string> }) {
  const { t } = useLang();
  const S = (key: string, fallback: string) => settings[key] || fallback;
  return (
    <section className="hero">
      <div className="wrap">
        <h1 className="hero-slogan">
          {S("hero_title", "LIKE IT. WANT IT. COP IT.").split(".").filter(Boolean).map((part, i, arr) => (
            <span key={i}>{part.trim()}<span className="dot">.</span>{i < arr.length - 1 ? " " : ""}</span>
          ))}
        </h1>
        <div className="hero-actions">
          <a href="/shop?promo=true" className="btn btn-primary">☆ {t("promo_btn")}</a>
          <a href="/shop" className="btn btn-outline">{t("hero_cta1")}</a>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const text = "NEW ARRIVAL ✕";
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1].map((i) =>
          [1, 2, 3, 4, 5, 6].map((_, idx) => (
            <span key={`${i}-${idx}`}>{text}</span>
          ))
        )}
      </div>
    </div>
  );
}

interface CatItem { nameFr: string; nameAr: string; nameEn: string; slug: string; imageUrl?: string; wide?: boolean; }

function CatPlaceholder() {
  return (
    <svg className="cat-card-placeholder" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="16" width="64" height="48" rx="4" />
      <circle cx="30" cy="36" r="8" />
      <path d="M8 54l18-14 14 12 12-10 20 16" />
    </svg>
  );
}

function Categories({ categories: dbCats, lang, t }: { categories: CatItem[]; lang: string; t: (k: string) => string }) {
  const nameKey = lang === "ar" ? "nameAr" : lang === "en" ? "nameEn" : "nameFr" as keyof CatItem;
  const cats = dbCats.length > 0 ? dbCats : [
    { nameFr: "Sneakers", nameAr: "سنيكرز", nameEn: "Sneakers", slug: "Chaussures" },
    { nameFr: "Vêtements", nameAr: "ملابس", nameEn: "Clothing", slug: "Vêtements" },
    { nameFr: "Accessoires", nameAr: "إكسسوارات", nameEn: "Accessories", slug: "Accessoires", wide: true },
  ] as CatItem[];
  return (
    <section className="wrap" data-reveal>
      <div className="section-head">
        <div><h2 className="text-heading">{t("cat_title")}</h2></div>
      </div>
      <div className="cat-grid">
        {cats.map((cat) => (
          <a key={cat.slug} href={`/shop?category=${encodeURIComponent(cat.slug)}`} className={`cat-card${cat.wide ? " wide" : ""}`}>
            <div className="cat-card-img-wrap">
              {cat.imageUrl ? (
                <img src={optimizeCldUrl(cat.imageUrl, { w: 800 })} alt="" loading="lazy" />
              ) : (
                <CatPlaceholder />
              )}
            </div>
            <div className="cat-card-body">
              <h3>{cat[nameKey]}</h3>
              <p>LE SHOP →</p>
            </div>
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
    <section className="wrap" data-reveal>
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

function WhyIcon({ name, size = 28 }: { name: string; size?: number }) {
  const s = size;
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", style: { width: s, height: s } } as const;
  switch (name) {
    case "check": return <svg {...props}><path d="M20 6L9 17l-5-5" /></svg>;
    case "truck": return <svg {...props}><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    case "map": return <svg {...props}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    case "refresh": return <svg {...props}><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>;
    default: return <svg {...props}><path d="M20 6L9 17l-5-5" /></svg>;
  }
}

function WhyUs({ items: dbItems, lang, t }: { items: WhyItem[]; lang: string; t: (k: string) => string }) {
  const fallback: WhyItem[] = [
    { icon: "check", headingFr: "Original Garanti", headingAr: "أصلي مضمون", headingEn: "Authentic Guaranteed", paragraphFr: "Tous nos produits sont 100% authentiques, vérifiés et scellés.", paragraphAr: "جميع منتجاتنا أصلية 100%", paragraphEn: "All products 100% authentic" },
    { icon: "truck", headingFr: "Paiement à la Livraison", headingAr: "الدفع عند الاستلام", headingEn: "Cash on Delivery", paragraphFr: "Payez uniquement lorsque vous recevez votre commande.", paragraphAr: "ادفع فقط عند استلام طلبك", paragraphEn: "Pay only when you receive" },
    { icon: "map", headingFr: "69 Wilayas Couvertes", headingAr: "69 ولاية مغطاة", headingEn: "69 Wilayas Covered", paragraphFr: "Livraison rapide dans toute l'Algérie, des grandes villes aux zones reculées.", paragraphAr: "توصيل سريع في جميع أنحاء الجزائر", paragraphEn: "Fast delivery across Algeria" },
    { icon: "refresh", headingFr: "Échange Facile", headingAr: "تبديل سهل", headingEn: "Easy Exchange", paragraphFr: "Satisfait ou échangé sous 7 jours. Procédure simple et rapide.", paragraphAr: "استبدال خلال 7 أيام", paragraphEn: "Exchange within 7 days" },
  ];
  const items = dbItems.length > 0 ? dbItems : fallback;
  const hKey = lang === "ar" ? "headingAr" : lang === "en" ? "headingEn" : "headingFr" as keyof WhyItem;
  const pKey = lang === "ar" ? "paragraphAr" : lang === "en" ? "paragraphEn" : "paragraphFr" as keyof WhyItem;
  return (
    <section className="wrap" data-reveal>
      <div className="section-head"><div><h2 className="text-heading">{t("why_title")}</h2></div></div>
      <div className="why-scroll">
        {items.map((item, i) => (
          <div key={i} className="why-card">
            {item.imageUrl ? (
              <div className="why-img-wrap"><img src={item.imageUrl} alt="" className="why-img" /></div>
            ) : (
              <WhyIcon name={item.icon} size={28} />
            )}
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
      <div className="section-head"><div><h2 className="text-heading">{t("faq_title")}</h2></div></div>
      <div>
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item ${i === openIdx ? "open" : ""}`}>
            <div className="faq-q" onClick={() => setOpenIdx(i === openIdx ? -1 : i)}>
              <span>{f[qKey]}</span>
              <div className="faq-q-icon">
                <svg className="plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><path d="M12 5v14M5 12h14" /></svg>
                <svg className="minus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><path d="M5 12h14" /></svg>
              </div>
            </div>
            <div className="faq-a"><p>{f[aKey]}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface WhyItem { icon: string; imageUrl?: string; headingFr: string; headingAr: string; headingEn: string; paragraphFr: string; paragraphAr: string; paragraphEn: string; }

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [productsError, setProductsError] = useState(false);
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [whyus, setWhyus] = useState<WhyItem[]>([]);
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
      api("/api/content?type=categories"),
      api("/api/slides?section=new_arrival"),
      api("/api/slides?section=promotion"),
      api("/api/landing"),
    ]).then(([faqD, whyD, catD, newD, promD, landD]) => {
      if (faqD.faqs?.length) setFaqs(faqD.faqs);
      if (whyD.items?.length) setWhyus(whyD.items);
      if (catD.categories?.length) setCategories(catD.categories);
      if (newD.slides?.length) setNewArrivalSlides(newD.slides);
      if (promD.slides?.length) setPromotionSlides(promD.slides);
      if (landD.settings) setLandingSettings(landD.settings);
    }).catch(() => {});
  }, []);

  useScrollReveal();

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
      <Marquee />
      <Categories categories={categories} lang={lang} t={t} />

      {newArrivalSlides.length > 0 ? (
        <SlidesSection
          slides={newArrivalSlides}
          title={L("new_arrival_title", t("new_title"))}
          subtitle={L("new_arrival_subtitle", t("new_sub"))}
          seeAllLink="/shop"
        />
      ) : (
        <section className="wrap" data-reveal>
          <div className="section-head">
            <div><h2 className="text-heading">{t("new_title")}</h2></div>
          </div>
          <div className="grid-products cols-3">
            {productsError ? (
              <p style={{ color: "var(--steel)", fontSize: 13, gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>{t("home_products_error")}</p>
            ) : (
              [...products].sort((a, b) => (a.position || 0) - (b.position || 0)).slice(0, 6).map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
              ))
            )}
          </div>
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <a href="/shop" className="btn btn-outline" style={{ padding: "14px 48px", fontSize: 12 }}>{t("see_all")}</a>
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

      <section className="wrap" style={{ padding: "30px 0", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16, display: "inline-block", verticalAlign: "middle", marginRight: 6, color: "var(--cop-dim)" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          {t("hero_policy")}
        </p>
      </section>

      <Footer />

      <div className={`toast ${toastMsg ? "show" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        <span>{toastMsg}</span>
      </div>
    </>
  );
}

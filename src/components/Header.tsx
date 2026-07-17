"use client";

import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function Header({ onCartOpen }: { onCartOpen: () => void }) {
  const { lang, setLang, t } = useLang();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoErr, setLogoErr] = useState(false);

  return (
    <header className="header">
      <div className="wrap nav">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button className="icon-btn hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
          <Link href="/" className="logo" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {logoErr ? (
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: 1 }}>COP<span style={{ color: "var(--cop)" }}>IT</span></span>
            ) : (
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src="/logo.png" alt="COPIT" style={{ height: 26, width: "auto", display: "block" }} onError={() => setLogoErr(true)} />
              </div>
            )}
            <span className="mono" style={{ fontSize: 10, letterSpacing: 1.2, color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", lineHeight: 1.2, maxWidth: 120 }}>
              {t("hero_slogan")}
            </span>
          </Link>
        </div>
        <nav className={`navlinks ${menuOpen ? "open" : ""}`}>
          <Link href="/shop?category=Chaussures" onClick={() => setMenuOpen(false)}>{t("nav_sneakers")}</Link>
          <Link href="/shop?category=Vêtements" onClick={() => setMenuOpen(false)}>{t("nav_clothes")}</Link>
          <Link href="/shop?category=Accessoires" onClick={() => setMenuOpen(false)}>{t("nav_accessories")}</Link>
          <Link href="/vip" onClick={() => setMenuOpen(false)}>{t("nav_vip")}</Link>
          <Link href="/shipping" onClick={() => setMenuOpen(false)}>{t("nav_shipping")}</Link>
        </nav>
        <div className="navright">
          <Link href="/shop" className="icon-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </Link>
          <div className="langswitch">
            {(["fr", "ar"] as const).map((l) => (
              <button key={l} className={lang === l ? "active" : ""} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="icon-btn" onClick={onCartOpen}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
      <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <Link href="/shop?category=Chaussures" onClick={() => setMenuOpen(false)}>{t("nav_sneakers")}</Link>
        <Link href="/shop?category=Vêtements" onClick={() => setMenuOpen(false)}>{t("nav_clothes")}</Link>
        <Link href="/shop?category=Accessoires" onClick={() => setMenuOpen(false)}>{t("nav_accessories")}</Link>
        <Link href="/vip" onClick={() => setMenuOpen(false)}>{t("nav_vip")}</Link>
        <Link href="/shipping" onClick={() => setMenuOpen(false)}>{t("nav_shipping")}</Link>
      </div>
    </header>
  );
}

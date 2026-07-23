"use client";

import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useState, useEffect, type JSX } from "react";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

const NAV_ICONS: Record<string, JSX.Element> = {
  sneakers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 16a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2H4Z" /><path d="M8 12V8l3-2h2l3 2v4" /></svg>,
  clothes: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 4h6l-3 6-3-2V4Z" /><path d="M9 4H3l3 6 3-2V4Z" /><path d="M9 4h6v16H9Z" /></svg>,
  accessories: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="6" /><path d="M4 20c0-4 3.6-8 8-8s8 4 8 8" /></svg>,
  vip: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  shipping: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
};

export default function Header({ onCartOpen }: { onCartOpen: () => void }) {
  const { lang, setLang, t } = useLang();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoErr, setLogoErr] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/shop?category=Chaussures", label: t("nav_sneakers"), key: "sneakers" },
    { href: "/shop?category=Vêtements", label: t("nav_clothes"), key: "clothes" },
    { href: "/shop?category=Accessoires", label: t("nav_accessories"), key: "accessories" },
    { href: "/vip", label: t("nav_vip"), key: "vip" },
    { href: "/shipping", label: t("nav_shipping"), key: "shipping" },
  ];

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="wrap nav">
        <div className="hdr-left">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <Link href="/" className="logo" aria-label="CopIt Home">
            {logoErr ? (
              <span className="display" style={{ fontSize: 20, letterSpacing: 1 }}>COP<span style={{ color: "var(--cop)" }}>IT</span></span>
            ) : (
              <img src="/logo.png" alt="COPIT" className="logo-img" onError={() => setLogoErr(true)} />
            )}
          </Link>
        </div>
        <nav className="navlinks">
          {navLinks.map((l) => (
            <Link key={l.key} href={l.href}>{l.label}</Link>
          ))}
        </nav>
        <div className="navright">
          <Link href="/shop" className="icon-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </Link>
          <div className="langswitch">
            {(["fr", "ar"] as const).map((l) => (
              <button key={l} className={lang === l ? "active" : ""} onClick={() => setLang(l)} aria-label={l === "fr" ? "Français" : "العربية"}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="icon-btn" onClick={onCartOpen} aria-label="Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </div>

      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
      <div className={`mobile-nav${menuOpen ? " open" : ""}`}>
        {navLinks.map((l) => (
          <Link key={l.key} href={l.href} onClick={() => setMenuOpen(false)}>
            {NAV_ICONS[l.key]}
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

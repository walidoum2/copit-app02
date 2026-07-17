"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useState } from "react";
import { useLang } from "@/contexts/LangContext";

export default function VipPage() {
  const { t } = useLang();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer show={cartOpen} onClose={() => setCartOpen(false)} />
      <div className="wrap page-head">
        <h1 className="display">{t("vip_title")}</h1>
      </div>
      <section className="wrap" style={{ padding: "40px 0 80px" }}>
        <div style={{ maxWidth: 600 }}>
          <p className="lead" style={{ fontSize: 19, lineHeight: 1.5, marginBottom: 20 }}>{t("vip_lead")}</p>
          <p style={{ color: "var(--steel)", fontSize: 15, lineHeight: 1.65 }}>{t("vip_desc")}</p>
          <a href="https://wa.me/213562829805" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: 32, display: "inline-flex" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm5.5 14.2c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.7 1.7.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.4.2.5.3.1.2.1.9-.2 1.5z" /></svg>
            {t("vip_cta")}
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
}

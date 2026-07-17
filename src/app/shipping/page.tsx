"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useLang } from "@/contexts/LangContext";

interface Rate { wilaya: string; homePrice: number; stopPrice: number; days: string; }

function money(n: number) { return n.toLocaleString("fr-FR") + " DA"; }

export default function ShippingPage() {
  const { t } = useLang();
  const [cartOpen, setCartOpen] = useState(false);
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shipping")
      .then(r => r.json())
      .then(d => { if (d.rates) setRates(d.rates); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer show={cartOpen} onClose={() => setCartOpen(false)} />
      <div className="wrap page-head">
        <h1 className="display">{t("shipping_title")}</h1>
        <p style={{ color: "var(--steel)", marginTop: 8 }}>{t("shipping_sub")}</p>
      </div>
      <section className="wrap" style={{ padding: "36px 0 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}><div className="spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t("shipping_wilaya")}</th>
                <th>{t("shipping_home")}</th>
                <th>{t("shipping_stop")}</th>
                <th>{t("shipping_days")}</th>
              </tr>
            </thead>
            <tbody>
              {rates.map(r => (
                <tr key={r.wilaya}>
                  <td>{r.wilaya}</td>
                  <td className="mono">{money(r.homePrice)}</td>
                  <td className="mono">{money(r.stopPrice)}</td>
                  <td className="mono" style={{ color: "var(--steel)" }}>{r.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <Footer />
    </>
  );
}

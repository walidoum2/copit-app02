"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LangContext";
import { WILAYAS, COMMUNES, FREE_SHIP_THRESHOLD } from "@/data/dictionary";

function money(n: number) { return n.toLocaleString("fr-FR") + " DA"; }

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [dtype, setDtype] = useState<"home" | "stopdesk">("home");

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState(WILAYAS[15]); // Alger
  const [commune, setCommune] = useState("");
  const [communeOther, setCommuneOther] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Shipping rates
  const [rates, setRates] = useState<Record<string, { homePrice: number; stopPrice: number; days: string }>>({});

  useEffect(() => {
    fetch("/api/shipping")
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, { homePrice: number; stopPrice: number; days: string }> = {};
        (d.rates || []).forEach((r: { wilaya: string; homePrice: number; stopPrice: number; days: string }) => {
          map[r.wilaya] = r;
        });
        setRates(map);
      })
      .catch(() => {});
  }, []);

  const rate = rates[wilaya] || { homePrice: 400, stopPrice: 250, days: "2-4j" };
  const shipCost = subtotal >= FREE_SHIP_THRESHOLD ? 0 : (dtype === "home" ? rate.homePrice : rate.stopPrice);
  const total = subtotal + shipCost;
  const communeList = COMMUNES[wilaya];

  async function handleSubmit() {
    if (!name || !phone || !address) {
      setToastMsg(t("check_required"));
      setTimeout(() => setToastMsg(""), 2600);
      return;
    }
    if (!/^0[5-7]\d{8}$/.test(phone.replace(/\s/g, ""))) {
      setToastMsg(t("check_phone"));
      setTimeout(() => setToastMsg(""), 2600);
      return;
    }

    const finalCommune = communeList ? commune : communeOther;
    if (!finalCommune) {
      setToastMsg(t("check_commune"));
      setTimeout(() => setToastMsg(""), 2600);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phone.replace(/\s/g, ""),
          wilaya,
          commune: finalCommune,
          address,
          notes,
          deliveryType: dtype,
          items: items.map((i) => ({
            productId: i.id,
            variantId: i.variantId,
            size: i.size,
            color: i.color,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal,
          shippingCost: shipCost,
          total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        setToastMsg(t("order_confirmed").replace("{id}", data.orderId));
        setTimeout(() => setToastMsg(""), 3000);
      } else {
        setToastMsg(data.error || t("order_failed"));
        setTimeout(() => setToastMsg(""), 3000);
      }
    } catch {
      setToastMsg(t("network_error"));
      setTimeout(() => setToastMsg(""), 3000);
    }
    setLoading(false);
  }

  return (
    <>
      <Header onCartOpen={() => {}} />
      <div className="wrap page-head">
        <h1 className="display">{t("checkout_title")}</h1>
      </div>
      <div className="wrap" style={{ paddingBottom: 90 }}>
        <div className="checkout-grid">
          <div className="form-card">
            <h3>{t("delivery_info")}</h3>
            <div className="frow">
              <div className="field"><label>{t("full_name")}</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("name_placeholder")} /></div>
              <div className="field"><label>{t("phone")}</label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("phone_placeholder")} /></div>
            </div>
            <div className="frow">
              <div className="field">
                <label>{t("wilaya")}</label>
                <select value={wilaya} onChange={(e) => { setWilaya(e.target.value); setCommune(""); }}>
                  {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t("commune")}</label>
                {communeList ? (
                  <select value={commune} onChange={(e) => setCommune(e.target.value)}>
                    <option value="">--</option>
                    {communeList.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input value={communeOther} onChange={(e) => setCommuneOther(e.target.value)} placeholder={t("commune_placeholder")} />
                )}
              </div>
            </div>
            <div className="field"><label>{t("address")}</label><input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rue, quartier, repère..." /></div>

            <label className="opt-label" style={{ marginTop: 6 }}>{t("delivery_type")}</label>
            <div className="dtype-row">
              <button className={`dtype ${dtype === "home" ? "sel" : ""}`} onClick={() => setDtype("home")}>
                <div className="lbl">{t("home_delivery")}</div>
                <div className="prc">{money(rate.homePrice)}</div>
              </button>
              <button className={`dtype ${dtype === "stopdesk" ? "sel" : ""}`} onClick={() => setDtype("stopdesk")}>
                <div className="lbl">{t("stopdesk")}</div>
                <div className="prc">{money(rate.stopPrice)}</div>
              </button>
            </div>

            <div className="field"><label>{t("notes")}</label><textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: livrer après 17h..." /></div>

            <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(200, 200, 200, 0.08)", border: "1px solid rgba(200, 200, 200, 0.25)", borderRadius: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--cop)" strokeWidth="2" style={{ width: 20, height: 20, flexShrink: 0 }}><path d="M20 6L9 17l-5-5" /></svg>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--cop)" }}>{t("payment_method")}</div>
                  <div style={{ fontSize: 12, color: "var(--steel)", marginTop: 2 }}>{t("cash_on_delivery")}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <h3>{t("order_summary")}</h3>
            {items.map((i) => (
              <div key={i.variantId} className="sum-row">
                <span>{i.quantity}× {i.name} ({i.size})</span>
                <span className="mono">{money(i.price * i.quantity)}</span>
              </div>
            ))}
            {subtotal >= FREE_SHIP_THRESHOLD && <div className="free-ship-note">{t("free_ship_note")}</div>}
            <div className="sum-row"><span>{t("subtotal")}</span><span className="mono">{money(subtotal)}</span></div>
            <div className="sum-row"><span>{t("shipping")}</span><span className="mono">{money(shipCost)}</span></div>
            <div className="sum-row total"><span>{t("total")}</span><span className="mono">{money(total)}</span></div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 18 }} onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="spinner" /> : t("confirm_order")}
            </button>
            <p style={{ fontSize: 11, color: "var(--steel)", marginTop: 12, textAlign: "center" }}>{t("confirm_note")}</p>
          </div>
        </div>
      </div>
      <Footer />

      <div className={`toast ${toastMsg ? "show" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        <span>{toastMsg}</span>
      </div>
    </>
  );
}

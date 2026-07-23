"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LangContext";
import { WILAYAS, COMMUNES, FREE_SHIP_THRESHOLD } from "@/data/dictionary";

function money(n: number) { return n.toLocaleString("fr-FR") + " DA"; }

interface ConfirmedOrder { id: string; items: { name: string; size: string; quantity: number; price: number }[]; total: number; }

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [dtype, setDtype] = useState<"home" | "stopdesk">("home");
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

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
        setConfirmedOrder({
          id: data.orderId,
          items: items.map(i => ({ name: i.name, size: i.size || "", quantity: i.quantity, price: i.price })),
          total,
        });
        clearCart();
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

  if (confirmedOrder) {
    return (
      <>
        <Header onCartOpen={() => {}} />
        <div className="wrap" style={{ padding: "80px 0 100px", maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg2)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--cop)" strokeWidth="2" style={{ width: 28, height: 28 }}><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 className="text-heading" style={{ fontSize: "clamp(28px, 5vw, 40px)" }}>
            {lang === "ar" ? "تم تأكيد طلبيتك!" : "Commande confirmée !"}
          </h1>
          <p className="mono" style={{ fontSize: 14, color: "var(--cop)", marginTop: 10 }}>
            {lang === "ar" ? `رقم الطلبية: ${confirmedOrder.id}` : `Réf: ${confirmedOrder.id}`}
          </p>
          <p style={{ fontSize: 14.5, color: "var(--steel)", marginTop: 18, lineHeight: 1.7, maxWidth: 420, margin: "18px auto 0" }}>
            {lang === "ar"
              ? "نتصل بك قريبًا لتأكيد التفاصيل. التوصيل في غضون 2 إلى 5 أيام حسب ولايتك."
              : "Nous te contactons sous peu pour confirmer les détails. Livraison sous 2 à 5 jours selon ta wilaya."}
          </p>

          <div style={{ background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 2, padding: 24, marginTop: 34, textAlign: "left" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {lang === "ar" ? "ملخص الطلبية" : "Résumé de la commande"}
            </h3>
            {confirmedOrder.items.map((item, i) => (
              <div key={i} className="sum-row" style={{ padding: "8px 0", borderBottom: i < confirmedOrder.items.length - 1 ? "1px solid var(--line)" : "none" }}>
                <span style={{ fontSize: 13.5 }}>{item.quantity}× {item.name}{item.size ? ` (${item.size})` : ""}</span>
                <span className="mono" style={{ fontSize: 13 }}>{money(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="sum-row total" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
              <span style={{ fontWeight: 700 }}>{lang === "ar" ? "المجموع" : "Total"}</span>
              <span className="mono" style={{ fontWeight: 700 }}>{money(confirmedOrder.total)}</span>
            </div>
          </div>

          <div style={{ marginTop: 30, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://wa.me/213562829805" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 12, textDecoration: "none" }}>
              {lang === "ar" ? "اتصل بنا على واتساب" : "Nous contacter sur WhatsApp"}
            </a>
            <a href="/track" className="btn btn-primary" style={{ fontSize: 12, textDecoration: "none" }}>
              {lang === "ar" ? "تتبع طلبيتك" : "Suivre ma commande"}
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header onCartOpen={() => {}} />
      <div className="wrap page-head">
        <h1 className="text-heading">{t("checkout_title")}</h1>
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

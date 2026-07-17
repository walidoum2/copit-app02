"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/contexts/LangContext";

interface Order {
  id: string;
  name: string;
  phone: string;
  wilaya: string;
  status: string;
  total: number;
  items: { productName: string; quantity: number }[];
  createdAt: string;
}

export default function TrackPage() {
  const { t } = useLang();
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  async function handleTrack() {
    if (!phone) return;
    setSearched(true);
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone.replace(/\s/g, ""))}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    }
  }

  return (
    <>
      <Header onCartOpen={() => {}} />
      <div className="wrap page-head"><h1 className="display">{t("track_title")}</h1></div>
      <div className="wrap" style={{ padding: "40px 0 100px", maxWidth: 520 }}>
        <div className="form-card">
          <div className="field">
            <label>{t("order_phone")}</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XX XX XX XX" />
          </div>
          <button className="btn btn-primary btn-block" onClick={handleTrack}>{t("check_status")}</button>
          {searched && (
            <div style={{ marginTop: 20 }}>
              {orders.length === 0 ? (
                <p style={{ color: "var(--steel)", fontSize: 13 }}>{t("track_empty")}</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="track-result">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="mono">{o.id}</span>
                      <span className={`status-pill ${o.status}`}>{o.status}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--steel)", marginTop: 8 }}>
                      {o.wilaya} · {o.total.toLocaleString("fr-FR")} DA · {o.items.length} {t("track_items")}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

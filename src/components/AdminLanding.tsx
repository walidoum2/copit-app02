"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";

interface LandingSettings {
  promo_text: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_visual_img: string;
  hero_visual_sku: string;
  hero_visual_title: string;
  hero_visual_stat: string;
  hero_visual_stat_label: string;
  new_arrival_title: string;
  new_arrival_subtitle: string;
  promo_title: string;
  promo_subtitle: string;
  [key: string]: string;
}

const DEFAULT_SETTINGS: LandingSettings = {
  promo_text: "Promos",
  hero_eyebrow: "DROP EN COURS — 69 WILAYAS",
  hero_title: "LIKE IT. WANT IT. COP IT.",
  hero_subtitle: "Sneakers et streetwear 100% originaux",
  hero_visual_img: "",
  hero_visual_sku: "SKU // CP-0192",
  hero_visual_title: "New Arrival",
  hero_visual_stat: "28K+",
  hero_visual_stat_label: "COPPERS",
  new_arrival_title: "Nouveautés",
  new_arrival_subtitle: "Fraîchement arrivés cette semaine.",
  promo_title: "Promotions",
  promo_subtitle: "Articles en promotion",
};

export default function AdminLanding() {
  const { t } = useLang();
  const [settings, setSettings] = useState<LandingSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2600);
  }

  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) { showToast("Upload failed"); return; }
      const data = await res.json();
      if (data.url) { update("hero_visual_img", data.url); showToast("Image uploaded!"); }
    } catch { showToast("Upload failed"); }
    finally { setUploading(false); }
  }

  useEffect(() => {
    fetch("/api/landing?_t=" + Date.now())
      .then(r => r.json())
      .then(d => {
        if (d.settings && Object.keys(d.settings).length > 0) {
          setSettings({ ...DEFAULT_SETTINGS, ...d.settings });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function update(key: string, value: string) {
    setSettings({ ...settings, [key]: value });
  }

  async function saveAll() {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await fetch("/api/admin/landing", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        });
      }
      showToast("Paramètres enregistrés !");
    } catch {
      showToast("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  const fields: { key: string; label: string; type?: string }[] = [
    { key: "promo_text", label: "Texte bandeau promo" },
    { key: "hero_eyebrow", label: "Hero - Sur-titre" },
    { key: "hero_title", label: "Hero - Titre principal" },
    { key: "hero_subtitle", label: "Hero - Sous-titre" },
    { key: "hero_visual_img", label: "Hero - Image (upload ou URL)" },
    { key: "hero_visual_sku", label: "Hero - SKU affiché" },
    { key: "hero_visual_title", label: "Hero - Titre du produit" },
    { key: "hero_visual_stat", label: "Hero - Statistique (ex: 28K+)" },
    { key: "hero_visual_stat_label", label: "Hero - Label stat (ex: COPPERS)" },
    { key: "new_arrival_title", label: "Nouveautés - Titre" },
    { key: "new_arrival_subtitle", label: "Nouveautés - Sous-titre" },
    { key: "promo_title", label: "Promotions - Titre" },
    { key: "promo_subtitle", label: "Promotions - Sous-titre" },
  ];

  if (loading) return <p style={{ color: "var(--steel)", margin: 20 }}>Loading...</p>;

  return (
    <div>
      <p style={{ color: "var(--steel)", fontSize: 12.5, marginBottom: 16 }}>
        Personnalise le texte de chaque section de la page d'accueil.
      </p>
      <div style={{ maxWidth: 600 }}>
        {fields.map(({ key, label }) => (
          <div key={key} className="field">
            <label>{label}</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={settings[key] || ""} onChange={e => update(key, e.target.value)} style={{ flex: 1 }} />
              {key === "hero_visual_img" && (
                <label style={{ whiteSpace: "nowrap", cursor: "pointer", padding: "8px 14px", background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 2, fontSize: 12 }}>
                  {uploading ? "..." : "+ Upload"}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleHeroImageUpload} />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" style={{ marginTop: 20 }} disabled={saving} onClick={saveAll}>
        {saving ? "Enregistrement..." : "Enregistrer tout"}
      </button>
      <div className={`toast ${toastMsg ? "show" : ""}`} style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)" }}>
        <span>{toastMsg}</span>
      </div>
    </div>
  );
}

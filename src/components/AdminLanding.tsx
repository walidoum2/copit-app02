"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import { LANDING_DEFAULTS } from "@/lib/landing";

interface LandingSettings {
  [key: string]: string;
}

const DEFAULT_SETTINGS: LandingSettings = { ...LANDING_DEFAULTS };

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

  async function handleImageUpload(key: string, e: React.ChangeEvent<HTMLInputElement>) {
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
      if (data.url) { update(key, data.url); showToast("Image uploaded!"); }
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

  const promoVisible = settings.promo_visible !== "0";

  const allFields: { key: string; label: string; type?: string }[] = [
    { key: "promo_text", label: "Bandeau promo - Texte" },
    { key: "promo_visible", label: "Bandeau promo - Visible" },
    { key: "promo_text_color", label: "Bandeau promo - Couleur texte", type: "color" },
    { key: "promo_bg_color", label: "Bandeau promo - Couleur fond", type: "color" },
    { key: "promo_font_size", label: "Bandeau promo - Taille police (px)" },
    { key: "promo_font_weight", label: "Bandeau promo - Poids (400/600/700/800)" },
    { key: "promo_border_radius", label: "Bandeau promo - Border radius (px)" },
    { key: "promo_padding_y", label: "Bandeau promo - Padding vertical (px)" },
    { key: "promo_padding_x", label: "Bandeau promo - Padding horizontal (px)" },
    { key: "hero_eyebrow", label: "Hero - Sur-titre" },
    { key: "hero_title", label: "Hero - Titre principal" },
    { key: "hero_subtitle", label: "Hero - Sous-titre" },
    { key: "hero_cta1", label: "Hero - Bouton principal (Voir le Drop)" },
    { key: "hero_cta2", label: "Hero - Bouton secondaire (Promos)" },
    { key: "hero_visual_img", label: "Hero - Image (upload ou URL)" },
    { key: "hero_visual_sku", label: "Hero - SKU affiché" },
    { key: "hero_visual_title", label: "Hero - Titre du produit" },
    { key: "hero_visual_stat", label: "Hero - Statistique (ex: 28K+)" },
    { key: "hero_visual_stat_label", label: "Hero - Label stat (ex: COPPERS)" },
    { key: "new_arrival_title", label: "Nouveautés - Titre" },
    { key: "new_arrival_subtitle", label: "Nouveautés - Sous-titre" },
    { key: "promo_title", label: "Promotions - Titre" },
    { key: "promo_subtitle", label: "Promotions - Sous-titre" },
    { key: "cat_title", label: "Shop par catégorie - Titre" },
    { key: "cat_cta", label: "Carte catégorie - Bouton (ex: Le Shop)" },
    { key: "new_title", label: "Produits - Titre (Dernières Sneakers)" },
    { key: "why_title", label: "Pourquoi nous - Titre" },
    { key: "why_badge", label: "Pourquoi nous - Badge (Authenticité vérifiée)" },
    { key: "faq_title", label: "FAQ - Titre" },
    { key: "btn_voir_plus", label: "Bouton - VOIR PLUS" },
    { key: "btn_tout_voir", label: "Bouton - TOUT VOIR" },
    { key: "foot_phone", label: "Footer - Téléphone" },
    { key: "foot_rights", label: "Footer - Droits réservés" },
    { key: "banner_chaussures_img", label: "Bannière Chaussures - Image (upload ou URL)" },
    { key: "banner_promo_img", label: "Bannière Promotions - Image (upload ou URL)" },
  ];

  if (loading) return <p style={{ color: "var(--steel)", margin: 20 }}>Loading...</p>;

  return (
    <div>
      <p style={{ color: "var(--steel)", fontSize: 12.5, marginBottom: 16 }}>
        Personnalise le texte de chaque section de la page d'accueil.
      </p>
      <div style={{ maxWidth: 600 }}>
        {allFields.map(({ key, label, type }) => (
          <div key={key} className="field">
            <label>{label}</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {key === "promo_visible" ? (
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13 }}>
                  <input type="checkbox" checked={promoVisible} onChange={e => update("promo_visible", e.target.checked ? "1" : "0")} style={{ width: 18, height: 18, accentColor: "var(--text)" }} />
                  {promoVisible ? "Visible sur le site" : "Masqué"}
                </label>
              ) : type === "color" ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
                  <input type="color" value={settings[key] || "#ffffff"} onChange={e => update(key, e.target.value)} style={{ width: 40, height: 36, padding: 0, border: "1px solid var(--line)", borderRadius: 4, cursor: "pointer", background: "none" }} />
                  <input value={settings[key] || ""} onChange={e => update(key, e.target.value)} style={{ flex: 1 }} placeholder="#ffffff" />
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
                  <input value={settings[key] || ""} onChange={e => update(key, e.target.value)} style={{ flex: 1 }} />
                  {key.endsWith("_img") && (
                    <label style={{ whiteSpace: "nowrap", cursor: "pointer", padding: "8px 14px", background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 2, fontSize: 12 }}>
                      {uploading ? "..." : "+ Upload"}
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleImageUpload(key, e)} />
                    </label>
                  )}
                </div>
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

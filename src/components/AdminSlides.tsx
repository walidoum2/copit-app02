"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";

interface Slide {
  id?: string;
  section: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  imageUrls: string;
  productId: string;
  linkUrl: string;
  autoRotate: boolean;
  rotationSpeed: number;
  active: boolean;
  position: number;
}

const EMPTY_SLIDE = (section: string): Slide => ({
  section,
  title: section === "new_arrival" ? "Nouveautés" : "Promotions",
  subtitle: "",
  price: 0,
  originalPrice: 0,
  imageUrls: "[]",
  productId: "",
  linkUrl: "",
  autoRotate: true,
  rotationSpeed: 4000,
  active: true,
  position: 0,
});

function SlideEditor({ item, onSave, onCancel }: { item: Slide; onSave: (i: Slide) => void; onCancel: () => void }) {
  const { t } = useLang();
  const [f, setF] = useState<Slide>(() => JSON.parse(JSON.stringify(item)));
  const [images, setImages] = useState<string[]>(() => {
    try { return JSON.parse(f.imageUrls || "[]"); } catch { return []; }
  });

  const set = (k: keyof Slide, v: any) => setF({ ...f, [k]: v });

  function addImage(url: string) {
    const updated = [...images, url];
    setImages(updated);
    setF({ ...f, imageUrls: JSON.stringify(updated) });
  }
  function removeImage(i: number) {
    const updated = images.filter((_, idx) => idx !== i);
    setImages(updated);
    setF({ ...f, imageUrls: JSON.stringify(updated) });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) return;
      const data = await res.json();
      if (data.url) addImage(data.url);
    } catch {}
  }

  return (
    <div style={{ background: "var(--ink2)", border: "1px solid var(--line)", borderRadius: 2, padding: 20, margin: "12px 0" }}>
      <div className="frow">
        <div className="field"><label>Titre</label><input value={f.title} onChange={e => set("title", e.target.value)} /></div>
        <div className="field"><label>Sous-titre</label><input value={f.subtitle} onChange={e => set("subtitle", e.target.value)} /></div>
      </div>
      <div className="frow">
        <div className="field"><label>Prix (DA)</label><input type="number" value={f.price} onChange={e => set("price", +e.target.value)} /></div>
        <div className="field"><label>Prix original (DA)</label><input type="number" value={f.originalPrice} onChange={e => set("originalPrice", +e.target.value)} /></div>
      </div>
      <div className="frow">
        <div className="field"><label>ID Produit lié (optionnel)</label><input value={f.productId} onChange={e => set("productId", e.target.value)} placeholder="laisser vide si aucun" /></div>
        <div className="field"><label>Lien personnalisé (optionnel)</label><input value={f.linkUrl} onChange={e => set("linkUrl", e.target.value)} placeholder="ex: /shop?promo=true" /></div>
      </div>
      <div className="frow">
        <div className="field"><label>Position (ordre d'affichage)</label><input type="number" value={f.position} onChange={e => set("position", +e.target.value)} /></div>
        <div className="field"><label>Vitesse rotation (ms)</label><input type="number" value={f.rotationSpeed} onChange={e => set("rotationSpeed", +e.target.value)} /></div>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8, marginBottom: 16 }}>
        <label style={{ fontSize: 11, color: "var(--steel)", display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={f.autoRotate} onChange={e => set("autoRotate", e.target.checked)} /> Rotation auto
        </label>
        <label style={{ fontSize: 11, color: "var(--steel)", display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={f.active} onChange={e => set("active", e.target.checked)} /> Active
        </label>
      </div>
      <div style={{ marginTop: 8 }}>
        <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--steel)", fontWeight: 700 }}>Images (glisse-dépose ou clique pour ajouter)</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {images.map((url, idx) => (
            <div key={idx} style={{ width: 90, height: 90, border: "1px solid var(--line)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button type="button" onClick={() => removeImage(idx)} style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: 11, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
          <label style={{ width: 90, height: 90, border: "1px dashed var(--line)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22, color: "var(--steel)" }}>
            +<input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
          </label>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button className="btn btn-primary" onClick={() => onSave(f)}>Enregistrer</button>
        <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
}

export default function AdminSlides({ section }: { section: "new_arrival" | "promotion" }) {
  const { t } = useLang();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  function loadSlides() {
    setLoading(true);
    fetch(`/api/admin/slides?section=${section}&_t=${Date.now()}`)
      .then(r => r.json())
      .then(d => { if (d.slides) setSlides(d.slides); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadSlides(); }, [section]);

  async function saveSlide(slide: Slide) {
    const isNew = !slide.id;
    const res = await fetch("/api/admin/slides", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slide),
    });
    if (res.ok) {
      setAdding(false);
      setEditingId(null);
      loadSlides();
    }
  }

  async function deleteSlide(id: string) {
    if (!confirm("Supprimer cette slide ?")) return;
    await fetch(`/api/admin/slides?id=${id}`, { method: "DELETE" });
    loadSlides();
  }

  if (loading) return <p style={{ color: "var(--steel)", margin: 20 }}>Loading...</p>;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => { setAdding(!adding); setEditingId(null); }}>
          {adding ? "− Annuler" : "+ Ajouter"}
        </button>
      </div>
      {adding && <SlideEditor item={EMPTY_SLIDE(section)} onSave={saveSlide} onCancel={() => setAdding(false)} />}
      {slides.length === 0 && !adding ? <p style={{ color: "var(--steel)", fontSize: 13 }}>Aucune slide pour le moment.</p> : null}
      {slides.map((slide) => (
        <div key={slide.id}>
          {editingId === slide.id ? (
            <SlideEditor item={slide} onSave={(s) => { saveSlide(s); setEditingId(null); }} onCancel={() => setEditingId(null)} />
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--steel)" }}>#{slide.position}</span>
                <span style={{ color: slide.active ? "var(--bone)" : "var(--steel)" }}>
                  {slide.title}{slide.subtitle ? ` — ${slide.subtitle}` : ""}
                </span>
                {slide.price > 0 && <span className="mono" style={{ color: "var(--cop)", fontSize: 11 }}>{slide.price.toLocaleString("fr-FR")} DA</span>}
                {!slide.active && <span className="status-pill cancelled" style={{ fontSize: 9 }}>Caché</span>}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-outline btn-sm" onClick={() => { setEditingId(slide.id!); setAdding(false); }}>Edit</button>
                <button className="btn btn-sm" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--steel)" }} onClick={() => deleteSlide(slide.id!)}>Del</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

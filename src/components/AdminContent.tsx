"use client";

import React, { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface FaqItem { id?: string; order: number; questionFr: string; questionAr: string; questionEn: string; answerFr: string; answerAr: string; answerEn: string; active: boolean; }
interface WhyUsItem { id?: string; order: number; icon: string; headingFr: string; headingAr: string; headingEn: string; paragraphFr: string; paragraphAr: string; paragraphEn: string; active: boolean; }
interface BrandItem { id?: string; name: string; hot: boolean; active: boolean; order: number; }
interface CategoryContentItem { id?: string; nameFr: string; nameAr: string; nameEn: string; slug: string; imageUrl?: string; active: boolean; order: number; }
interface FooterLinkItem { id?: string; section: string; labelFr: string; labelAr: string; labelEn: string; url: string; order: number; active: boolean; }

type ContentType = "faq" | "whyus" | "brands" | "categories" | "footer";

const ICONS = ["check", "truck", "map", "refresh"];

const EMPTY: Record<ContentType, any> = {
  faq: { order: 0, questionFr: "", questionAr: "", questionEn: "", answerFr: "", answerAr: "", answerEn: "", active: true },
  whyus: { order: 0, icon: "check", headingFr: "", headingAr: "", headingEn: "", paragraphFr: "", paragraphAr: "", paragraphEn: "", active: true },
  brands: { name: "", hot: false, active: true, order: 0 },
  categories: { nameFr: "", nameAr: "", nameEn: "", slug: "", imageUrl: "", active: true, order: 0 },
  footer: { section: "shop", labelFr: "", labelAr: "", labelEn: "", url: "", order: 0, active: true },
};

/* ------------------------------------------------------------------ */
/*  Icon SVG picker                                                   */
/* ------------------------------------------------------------------ */
function IconSvg({ name, size = 18 }: { name: string; size?: number }) {
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", style: { width: size, height: size } } as const;
  switch (name) {
    case "check": return <svg {...props}><path d="M20 6L9 17l-5-5" /></svg>;
    case "truck": return <svg {...props}><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    case "map": return <svg {...props}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    case "refresh": return <svg {...props}><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>;
    default: return <svg {...props}><path d="M20 6L9 17l-5-5" /></svg>;
  }
}

function SectionBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="btn btn-outline btn-sm" onClick={onClick} style={{ whiteSpace: "nowrap" }}>{label}</button>;
}

/* ------------------------------------------------------------------ */
/*  Inline editor for each content type                                        */
/* ------------------------------------------------------------------ */
function FaqEditor({ item, onSave, onCancel }: { item: FaqItem; onSave: (i: FaqItem) => void; onCancel: () => void }) {
  const { t } = useLang();
  const [f, setF] = useState<FaqItem>(() => JSON.parse(JSON.stringify(item)));
  const set = (k: keyof FaqItem, v: any) => setF({ ...f, [k]: v });
  return (
    <div style={{ background: "var(--ink2)", border: "1px solid var(--line)", borderRadius: 2, padding: 20, margin: "12px 0" }}>
      <div className="frow"><div className="field"><label>{t("admin_content_fr")} {t("admin_content_question")}</label><input value={f.questionFr} onChange={e => set("questionFr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_ar")} {t("admin_content_question")}</label><input value={f.questionAr} onChange={e => set("questionAr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_en")} {t("admin_content_question")}</label><input value={f.questionEn} onChange={e => set("questionEn", e.target.value)} /></div></div>
      <div className="frow"><div className="field"><label>{t("admin_content_fr")} {t("admin_content_answer")}</label><textarea rows={2} value={f.answerFr} onChange={e => set("answerFr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_ar")} {t("admin_content_answer")}</label><textarea rows={2} value={f.answerAr} onChange={e => set("answerAr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_en")} {t("admin_content_answer")}</label><textarea rows={2} value={f.answerEn} onChange={e => set("answerEn", e.target.value)} /></div></div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 12 }}>
        <label style={{ fontSize: 11, color: "var(--steel)" }}>{t("admin_content_order")}: <input type="number" value={f.order} onChange={e => set("order", +e.target.value)} style={{ width: 60, background: "var(--ink)", border: "1px solid var(--line)", color: "var(--bone)", padding: "4px 6px", fontSize: 12, borderRadius: 2, marginLeft: 6 }} /></label>
        <label style={{ fontSize: 11, color: "var(--steel)", display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={f.active} onChange={e => set("active", e.target.checked)} /> Active</label>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="btn btn-primary" disabled={!f.questionFr} onClick={() => onSave(f)}>{t("admin_content_save")}</button>
        <button className="btn btn-outline" onClick={onCancel}>{t("admin_content_cancel")}</button>
      </div>
    </div>
  );
}

function WhyUsEditor({ item, onSave, onCancel }: { item: WhyUsItem; onSave: (i: WhyUsItem) => void; onCancel: () => void }) {
  const { t } = useLang();
  const [f, setF] = useState<WhyUsItem>(() => JSON.parse(JSON.stringify(item)));
  const set = (k: keyof WhyUsItem, v: any) => setF({ ...f, [k]: v });
  return (
    <div style={{ background: "var(--ink2)", border: "1px solid var(--line)", borderRadius: 2, padding: 20, margin: "12px 0" }}>
      <div className="frow"><div className="field"><label>{t("admin_content_fr")} {t("admin_content_heading")}</label><input value={f.headingFr} onChange={e => set("headingFr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_ar")} {t("admin_content_heading")}</label><input value={f.headingAr} onChange={e => set("headingAr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_en")} {t("admin_content_heading")}</label><input value={f.headingEn} onChange={e => set("headingEn", e.target.value)} /></div></div>
      <div className="frow"><div className="field"><label>{t("admin_content_fr")} {t("admin_content_paragraph")}</label><textarea rows={2} value={f.paragraphFr} onChange={e => set("paragraphFr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_ar")} {t("admin_content_paragraph")}</label><textarea rows={2} value={f.paragraphAr} onChange={e => set("paragraphAr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_en")} {t("admin_content_paragraph")}</label><textarea rows={2} value={f.paragraphEn} onChange={e => set("paragraphEn", e.target.value)} /></div></div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 12 }}>
        <label style={{ fontSize: 11, color: "var(--steel)" }}>{t("admin_content_icon")}: <select value={f.icon} onChange={e => set("icon", e.target.value)} style={{ background: "var(--ink)", border: "1px solid var(--line)", color: "var(--bone)", padding: "4px 6px", fontSize: 12, borderRadius: 2, marginLeft: 6 }}>{ICONS.map(i => <option key={i} value={i}>{i}</option>)}</select></label>
        <IconSvg name={f.icon} size={22} />
        <label style={{ fontSize: 11, color: "var(--steel)" }}>{t("admin_content_order")}: <input type="number" value={f.order} onChange={e => set("order", +e.target.value)} style={{ width: 60, background: "var(--ink)", border: "1px solid var(--line)", color: "var(--bone)", padding: "4px 6px", fontSize: 12, borderRadius: 2, marginLeft: 6 }} /></label>
        <label style={{ fontSize: 11, color: "var(--steel)", display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={f.active} onChange={e => set("active", e.target.checked)} /> Active</label>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="btn btn-primary" disabled={!f.headingFr} onClick={() => onSave(f)}>{t("admin_content_save")}</button>
        <button className="btn btn-outline" onClick={onCancel}>{t("admin_content_cancel")}</button>
      </div>
    </div>
  );
}

function BrandsEditor({ item, onSave, onCancel }: { item: BrandItem; onSave: (i: BrandItem) => void; onCancel: () => void }) {
  const { t } = useLang();
  const [f, setF] = useState<BrandItem>(() => JSON.parse(JSON.stringify(item)));
  const set = (k: keyof BrandItem, v: any) => setF({ ...f, [k]: v });
  return (
    <div style={{ background: "var(--ink2)", border: "1px solid var(--line)", borderRadius: 2, padding: 20, margin: "12px 0" }}>
      <div className="frow">
        <div className="field"><label>{t("admin_content_name")}</label><input value={f.name} onChange={e => set("name", e.target.value)} /></div>
        <div className="field"><label>{t("admin_content_order")}</label><input type="number" value={f.order} onChange={e => set("order", +e.target.value)} /></div>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
        <label style={{ fontSize: 11, color: "var(--steel)", display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={f.hot} onChange={e => set("hot", e.target.checked)} /> {t("admin_content_hot")}</label>
        <label style={{ fontSize: 11, color: "var(--steel)", display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={f.active} onChange={e => set("active", e.target.checked)} /> Active</label>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="btn btn-primary" disabled={!f.name} onClick={() => onSave(f)}>{t("admin_content_save")}</button>
        <button className="btn btn-outline" onClick={onCancel}>{t("admin_content_cancel")}</button>
      </div>
    </div>
  );
}

function CategoriesEditor({ item, onSave, onCancel }: { item: CategoryContentItem; onSave: (i: CategoryContentItem) => void; onCancel: () => void }) {
  const { t } = useLang();
  const [f, setF] = useState<CategoryContentItem>(() => JSON.parse(JSON.stringify(item)));
  const set = (k: keyof CategoryContentItem, v: any) => setF({ ...f, [k]: v });

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
      if (data.url) set("imageUrl", data.url);
    } catch {}
  }

  return (
    <div style={{ background: "var(--ink2)", border: "1px solid var(--line)", borderRadius: 2, padding: 20, margin: "12px 0" }}>
      <div className="frow"><div className="field"><label>{t("admin_content_fr")} {t("admin_content_name")}</label><input value={f.nameFr} onChange={e => set("nameFr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_ar")} {t("admin_content_name")}</label><input value={f.nameAr} onChange={e => set("nameAr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_en")} {t("admin_content_name")}</label><input value={f.nameEn} onChange={e => set("nameEn", e.target.value)} /></div></div>
      <div className="frow">
        <div className="field"><label>{t("admin_content_slug")}</label><input value={f.slug} onChange={e => set("slug", e.target.value)} /></div>
        <div className="field"><label>{t("admin_content_order")}</label><input type="number" value={f.order} onChange={e => set("order", +e.target.value)} /></div>
      </div>
      <div style={{ marginTop: 8 }}>
        <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--steel)", fontWeight: 700 }}>Image</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
          {f.imageUrl ? (
            <div style={{ width: 80, height: 80, border: "1px solid var(--line)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
              <img src={f.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button type="button" onClick={() => set("imageUrl", "")} style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: 11, borderRadius: "50%", cursor: "pointer" }}>×</button>
            </div>
          ) : (
            <label style={{ width: 80, height: 80, border: "1px dashed var(--line)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22, color: "var(--steel)" }}>
              +<input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
            </label>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
        <label style={{ fontSize: 11, color: "var(--steel)", display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={f.active} onChange={e => set("active", e.target.checked)} /> Active</label>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="btn btn-primary" disabled={!f.nameFr || !f.slug} onClick={() => onSave(f)}>{t("admin_content_save")}</button>
        <button className="btn btn-outline" onClick={onCancel}>{t("admin_content_cancel")}</button>
      </div>
    </div>
  );
}

function FooterEditor({ item, onSave, onCancel }: { item: FooterLinkItem; onSave: (i: FooterLinkItem) => void; onCancel: () => void }) {
  const { t } = useLang();
  const [f, setF] = useState<FooterLinkItem>(() => JSON.parse(JSON.stringify(item)));
  const set = (k: keyof FooterLinkItem, v: any) => setF({ ...f, [k]: v });
  return (
    <div style={{ background: "var(--ink2)", border: "1px solid var(--line)", borderRadius: 2, padding: 20, margin: "12px 0" }}>
      <div className="frow">
        <div className="field"><label>{t("admin_content_section")}</label><select value={f.section} onChange={e => set("section", e.target.value)} style={{ background: "var(--ink)", border: "1px solid var(--line)", color: "var(--bone)", padding: "6px 8px", fontSize: 12, borderRadius: 2, width: "100%" }}><option value="shop">Shop</option><option value="help">Help</option><option value="legal">Legal</option></select></div>
        <div className="field"><label>{t("admin_content_url")}</label><input value={f.url} onChange={e => set("url", e.target.value)} /></div>
      </div>
      <div className="frow"><div className="field"><label>{t("admin_content_fr")} {t("admin_content_label")}</label><input value={f.labelFr} onChange={e => set("labelFr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_ar")} {t("admin_content_label")}</label><input value={f.labelAr} onChange={e => set("labelAr", e.target.value)} /></div>
      <div className="field"><label>{t("admin_content_en")} {t("admin_content_label")}</label><input value={f.labelEn} onChange={e => set("labelEn", e.target.value)} /></div></div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
        <label style={{ fontSize: 11, color: "var(--steel)" }}>{t("admin_content_order")}: <input type="number" value={f.order} onChange={e => set("order", +e.target.value)} style={{ width: 60, background: "var(--ink)", border: "1px solid var(--line)", color: "var(--bone)", padding: "4px 6px", fontSize: 12, borderRadius: 2, marginLeft: 6 }} /></label>
        <label style={{ fontSize: 11, color: "var(--steel)", display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={f.active} onChange={e => set("active", e.target.checked)} /> Active</label>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="btn btn-primary" disabled={!f.labelFr || !f.url} onClick={() => onSave(f)}>{t("admin_content_save")}</button>
        <button className="btn btn-outline" onClick={onCancel}>{t("admin_content_cancel")}</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Generic list + editor wrapper                                     */
/* ------------------------------------------------------------------ */
function ContentList<T extends { id?: string; active?: boolean }>({
  items, Editor, renderLabel, onSave, onDelete, emptyLabel, addLabel, emptyItem,
}: {
  items: T[];
  Editor: (props: { item: T; onSave: (i: T) => void; onCancel: () => void }) => React.ReactNode;
  renderLabel: (item: T) => string;
  onSave: (item: T) => void;
  onDelete: (id: string) => void;
  emptyLabel: string;
  addLabel: string;
  emptyItem: T;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ marginBottom: 12 }}>
        <button className="btn btn-primary" onClick={() => { setAdding(!adding); setEditingId(null); }}>
          {adding ? "− " + addLabel : "+ " + addLabel}
        </button>
      </div>
      {adding && <Editor item={emptyItem} onSave={(i) => { onSave(i); setAdding(false); }} onCancel={() => setAdding(false)} />}
      {items.length === 0 && !adding ? <p style={{ color: "var(--steel)", fontSize: 13 }}>{emptyLabel}</p> : null}
      {items.map((item) => (
        <div key={item.id || Math.random().toString()}>
          {editingId === item.id ? (
            <Editor item={item} onSave={(i) => { onSave(i); setEditingId(null); }} onCancel={() => setEditingId(null)} />
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
              <span style={{ color: item.active ? "var(--bone)" : "var(--steel)" }}>{renderLabel(item)}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <SectionBtn label="Edit" onClick={() => { setEditingId(item.id!); setAdding(false); }} />
                <SectionBtn label="Del" onClick={() => { if (confirm("Delete?")) onDelete(item.id!); }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main AdminContent export                                          */
/* ------------------------------------------------------------------ */
export default function AdminContent() {
  const { t } = useLang();
  const [sub, setSub] = useState<ContentType>("faq");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [whyus, setWhyus] = useState<WhyUsItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [categories, setCategories] = useState<CategoryContentItem[]>([]);
  const [footer, setFooter] = useState<FooterLinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  function loadAll() {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/content?type=faq").then(r => r.json()),
      fetch("/api/admin/content?type=whyus").then(r => r.json()),
      fetch("/api/admin/content?type=brands").then(r => r.json()),
      fetch("/api/admin/content?type=categories").then(r => r.json()),
      fetch("/api/admin/content?type=footer").then(r => r.json()),
    ]).then(([faqD, whyD, brandD, catD, footD]) => {
      if (faqD.faqs) setFaqs(faqD.faqs);
      if (whyD.items) setWhyus(whyD.items);
      if (brandD.brands) setBrands(brandD.brands);
      if (catD.categories) setCategories(catD.categories);
      if (footD.links) setFooter(footD.links);
    }).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { loadAll(); }, []);

  async function save(type: ContentType, item: any) {
    const isNew = !item.id;
    const res = await fetch(`/api/admin/content?type=${type}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) loadAll();
  }

  async function del(type: ContentType, id: string) {
    await fetch(`/api/admin/content?type=${type}&id=${id}`, { method: "DELETE" });
    loadAll();
  }

  const subs: { key: ContentType; label: string }[] = [
    { key: "faq", label: t("admin_content_faq") },
    { key: "whyus", label: t("admin_content_whyus") },
    { key: "brands", label: t("admin_content_brands") },
    { key: "categories", label: t("admin_content_categories") },
    { key: "footer", label: t("admin_content_footer") },
  ];

  if (loading) return <p style={{ color: "var(--steel)", margin: 20 }}>Loading...</p>;

  return (
    <div>
      <div className="admin-tabs" style={{ marginBottom: 16 }}>
        {subs.map(s => (
          <button key={s.key} className={sub === s.key ? "active" : ""} onClick={() => setSub(s.key)}>{s.label}</button>
        ))}
      </div>

      {sub === "faq" && (
        <ContentList
          items={faqs}
          Editor={FaqEditor}
          emptyItem={{ order: faqs.length, questionFr: "", questionAr: "", questionEn: "", answerFr: "", answerAr: "", answerEn: "", active: true } as FaqItem}
          renderLabel={(f: FaqItem) => `${f.order ? f.order + ". " : ""}${f.questionFr || f.questionEn || f.questionAr}`}
          onSave={(i) => save("faq", i)}
          onDelete={(id) => del("faq", id)}
          emptyLabel="No FAQ items yet."
          addLabel={t("admin_content_add")}
        />
      )}

      {sub === "whyus" && (
        <ContentList
          items={whyus}
          Editor={WhyUsEditor}
          emptyItem={{ order: whyus.length, icon: "check", headingFr: "", headingAr: "", headingEn: "", paragraphFr: "", paragraphAr: "", paragraphEn: "", active: true } as WhyUsItem}
          renderLabel={(f: WhyUsItem) => `${f.order ? f.order + ". " : ""}${f.headingFr || f.headingEn || f.headingAr}`}
          onSave={(i) => save("whyus", i)}
          onDelete={(id) => del("whyus", id)}
          emptyLabel="No Why Us items yet."
          addLabel={t("admin_content_add")}
        />
      )}

      {sub === "brands" && (
        <ContentList
          items={brands}
          Editor={BrandsEditor}
          emptyItem={{ name: "", hot: false, active: true, order: brands.length } as BrandItem}
          renderLabel={(f: BrandItem) => `${f.name}${f.hot ? " 🔥" : ""}`}
          onSave={(i) => save("brands", i)}
          onDelete={(id) => del("brands", id)}
          emptyLabel="No brands yet."
          addLabel={t("admin_content_add")}
        />
      )}

      {sub === "categories" && (
        <ContentList
          items={categories}
          Editor={CategoriesEditor}
          emptyItem={{ nameFr: "", nameAr: "", nameEn: "", slug: "", active: true, order: categories.length } as CategoryContentItem}
          renderLabel={(f: CategoryContentItem) => `${f.nameFr || f.nameEn || f.nameAr} (${f.slug})`}
          onSave={(i) => save("categories", i)}
          onDelete={(id) => del("categories", id)}
          emptyLabel="No categories yet."
          addLabel={t("admin_content_add")}
        />
      )}

      {sub === "footer" && (
        <ContentList
          items={footer}
          Editor={FooterEditor}
          emptyItem={{ section: "shop", labelFr: "", labelAr: "", labelEn: "", url: "", order: footer.length, active: true } as FooterLinkItem}
          renderLabel={(f: FooterLinkItem) => `[${f.section}] ${f.labelFr || f.labelEn || f.labelAr} → ${f.url}`}
          onSave={(i) => save("footer", i)}
          onDelete={(id) => del("footer", id)}
          emptyLabel="No footer links yet."
          addLabel={t("admin_content_add")}
        />
      )}
    </div>
  );
}

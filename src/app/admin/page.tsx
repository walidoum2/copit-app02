"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import AdminContent from "@/components/AdminContent";
import AdminSlides from "@/components/AdminSlides";
import AdminLanding from "@/components/AdminLanding";

function money(n: number) { return n.toLocaleString("fr-FR") + " DA"; }

interface Order {
  id: string; name: string; phone: string; wilaya: string; commune: string; address: string; status: string;
  total: number; subtotal: number; shippingCost: number; deliveryType: string;
  items: { productName: string; brand: string; quantity: number; size: string; color: string; price: number }[];
  createdAt: string; procolisId: string | null;
}
interface ShippingRate { wilaya: string; homePrice: number; stopPrice: number; days: string; }
interface Product { id: string; name: string; brand: string; category: string; price: number; originalPrice: number; material: string; sku: string; tag: string; active: boolean; position: number; variants: { id?: string; size: string; color: string; colorHex: string; stock: number }[]; images: { id?: string; url: string; alt?: string }[]; }

const DEFAULT_VARIANT = { size: "", color: "", colorHex: "#888888", stock: 0 };
const EMPTY_PRODUCT: Product = { id: "", name: "", brand: "CopIt Basics", category: "Chaussures", price: 0, originalPrice: 0, material: "", sku: "", tag: "", active: true, position: 0, variants: [{ ...DEFAULT_VARIANT }], images: [] };

function ProductFormInner({ product: prod, onSave, onCancel, showToast, saving }: { product: Product; onSave: (p: Product) => void; onCancel: () => void; showToast: (msg: string) => void; saving: boolean }) {
  const { t } = useLang();
  const [form, setForm] = useState<Product>(() => JSON.parse(JSON.stringify(prod)));

  function updateField(k: keyof Product, v: string | number | boolean) {
    setForm({ ...form, [k]: v });
  }

  function updateVariant(i: number, k: string, v: string | number) {
    const vs = [...form.variants];
    vs[i] = { ...vs[i], [k]: v };
    setForm({ ...form, variants: vs });
  }

  function addVariant() { setForm({ ...form, variants: [...form.variants, { ...DEFAULT_VARIANT }] }); }
  function removeVariant(i: number) { const vs = form.variants.filter((_, idx) => idx !== i); setForm({ ...form, variants: vs }); }

  function addImage(url: string) {
    setForm({ ...form, images: [...form.images, { url }] });
  }
  function removeImage(i: number) {
    setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) { showToast("Upload failed"); return; }
      const data = await res.json();
      if (data.url) addImage(data.url);
      else showToast("Upload failed");
    } catch { showToast("Upload failed"); }
  }

  const isValid = form.name && form.brand && form.category && form.price > 0 && form.sku && form.variants.every(v => v.size && v.color);

  return (
    <div style={{ background: "var(--ink2)", border: "1px solid var(--line)", borderRadius: 2, padding: 24, margin: "16px 0" }}>
      <div className="frow">
        <div className="field"><label>Name</label><input value={form.name} onChange={e => updateField("name", e.target.value)} /></div>
        <div className="field"><label>Brand</label><input value={form.brand} onChange={e => updateField("brand", e.target.value)} /></div>
      </div>
      <div className="frow">
        <div className="field"><label>Category</label><input value={form.category} onChange={e => updateField("category", e.target.value)} /></div>
        <div className="field"><label>SKU</label><input value={form.sku} onChange={e => updateField("sku", e.target.value)} /></div>
      </div>
      <div className="frow">
        <div className="field"><label>Price (DA)</label><input type="number" value={form.price} onChange={e => updateField("price", +e.target.value)} /></div>
        <div className="field"><label>Original Price (DA)</label><input type="number" value={form.originalPrice} onChange={e => updateField("originalPrice", +e.target.value)} /></div>
      </div>
      <div className="frow">
        <div className="field"><label>Material</label><input value={form.material} onChange={e => updateField("material", e.target.value)} /></div>
        <div className="field"><label>Tag</label><input value={form.tag} onChange={e => updateField("tag", e.target.value)} placeholder="e.g. Best-seller" /></div>
      </div>
      <div className="frow">
        <div className="field"><label>Position (display order)</label><input type="number" value={form.position} onChange={e => updateField("position", +e.target.value)} /></div>
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--steel)", fontWeight: 700 }}>{t("admin_variant")}</label>
        {form.variants.map((v, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
            <input placeholder="Size" value={v.size} onChange={e => updateVariant(i, "size", e.target.value)} style={{ width: 70, background: "var(--ink)", border: "1px solid var(--line)", color: "var(--bone)", padding: "6px 8px", fontSize: 12, borderRadius: 2 }} />
            <input placeholder="Color" value={v.color} onChange={e => updateVariant(i, "color", e.target.value)} style={{ width: 100, background: "var(--ink)", border: "1px solid var(--line)", color: "var(--bone)", padding: "6px 8px", fontSize: 12, borderRadius: 2 }} />
            <input type="color" value={v.colorHex} onChange={e => updateVariant(i, "colorHex", e.target.value)} style={{ width: 34, height: 34, padding: 0, border: "1px solid var(--line)", borderRadius: 2, background: "none", cursor: "pointer" }} />
            <input type="number" placeholder="Stock" value={v.stock} onChange={e => updateVariant(i, "stock", +e.target.value)} style={{ width: 65, background: "var(--ink)", border: "1px solid var(--line)", color: "var(--bone)", padding: "6px 8px", fontSize: 12, borderRadius: 2 }} />
            <button onClick={() => removeVariant(i)} style={{ background: "none", border: "1px solid var(--line)", color: "var(--steel)", width: 28, height: 28, borderRadius: 2, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        ))}
        <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={addVariant}>+ Variant</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--steel)", fontWeight: 700 }}>Images</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {form.images.map((img, i) => (
            <div key={i} style={{ width: 70, height: 70, border: "1px solid var(--line)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
              <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: 11, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
          {form.images.length < 4 && (
            <label style={{ width: 70, height: 70, border: "1px dashed var(--line)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22, color: "var(--steel)" }}>
              +<input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
            </label>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button className="btn btn-primary" disabled={!isValid || saving} onClick={() => onSave(form)}>{saving ? t("admin_saving") : t("admin_save")}</button>
        <button className="btn btn-outline" onClick={onCancel}>{t("admin_cancel")}</button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { t } = useLang();
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"orders" | "products" | "shipping" | "content" | "newarrivals" | "promotions" | "landing">("orders");
  const [toastMsg, setToastMsg] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(""), 2600); }

  async function login() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) { setAuthed(true); loadAll(); } else { showToast(data.error || "Invalid credentials"); }
  }

  async function loadAll() {
    try {
      const [ordersRes, ratesRes, productsRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/shipping"),
        fetch("/api/admin/products"),
      ]);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }
      if (ratesRes.ok) {
        const ratesData = await ratesRes.json();
        setRates(ratesData.rates || []);
      }
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }
    } catch {
      showToast("Database not connected — some features may be limited");
    }
  }

  useEffect(() => { if (authed) loadAll(); }, [authed]);

  async function toggleOrderStatus(id: string, newStatus: string) {
    if (newStatus === "cancelled" && !confirm("Cancel this order?")) return;
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) { loadAll(); showToast(`Order ${id} → ${newStatus}`); }
    else { const d = await res.json(); showToast(d.error || "Failed"); }
  }

  async function saveRates() {
    await fetch("/api/admin/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rates }),
    });
    showToast("Shipping rates saved!");
  }

  async function saveProduct(product: Product) {
    setSaving(true);
    try {
      const isNew = !product.id;
      const body = {
        ...(isNew ? {} : { id: product.id }),
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        material: product.material,
        sku: product.sku,
        tag: product.tag || "",
        active: product.active,
        position: product.position,
        variants: product.variants.map(v => ({ size: v.size, color: v.color, colorHex: v.colorHex, stock: v.stock })),
        images: product.images.map(i => i.url),
      };
      const res = await fetch("/api/admin/products", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showToast(isNew ? "Product created!" : "Product updated!");
        setEditingProduct(null);
        setShowNewForm(false);
        loadAll();
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to save product");
      }
    } catch { showToast("Failed to save product"); }
    finally { setSaving(false); }
  }

  async function toggleProductActive(id: string, current: boolean) {
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !current }),
    });
    loadAll();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    loadAll();
    showToast("Product deleted");
  }

  async function moveProduct(id: string, dir: "up" | "down") {
    const sorted = [...products].sort((a, b) => (a.position || 0) - (b.position || 0));
    const idx = sorted.findIndex(p => p.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === sorted.length - 1) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    const item = sorted.splice(idx, 1)[0];
    sorted.splice(swapIdx, 0, item);
    const updates = sorted.map((p, i) => ({ id: p.id, position: i }));
    try {
      const results = await Promise.all(
        updates.map(u => fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(u),
        }))
      );
      const errors = results.filter(r => !r.ok);
      if (errors.length > 0) {
        const details = await Promise.all(errors.map(r => r.text().catch(() => "Unknown")));
        showToast("Erreur: " + details.join(", ").slice(0, 60));
      } else {
        setProducts(prev => {
          const updated = [...prev];
          updates.forEach(u => {
            const p = updated.find(x => x.id === u.id);
            if (p) p.position = u.position;
          });
          return updated;
        });
        loadAll();
        showToast("Produit repositionné");
      }
    } catch (e) { showToast("Erreur réseau: " + (e instanceof Error ? e.message : "")); }
  }

  if (!authed) {
    return (
      <div className="wrap">
        <div className="admin-gate">
          <div className="eyebrow">ADMIN ACCESS</div>
          <h2 className="display" style={{ fontSize: 28, marginTop: 10 }}>{t("admin_dashboard")}</h2>
          <input placeholder={t("admin_email")} value={email} onChange={(e) => setEmail(e.target.value)} />
          <div style={{ position: "relative" }}>
            <input placeholder={t("admin_password")} type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} style={{ width: "100%", paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--steel)", cursor: "pointer", padding: 4, fontSize: 18 }}>
              {showPass ? "👁" : "🙈"}
            </button>
          </div>
          <button className="btn btn-primary btn-block" onClick={login}>Entrer</button>
        </div>
        <div className={`toast ${toastMsg ? "show" : ""}`}><span>{toastMsg}</span></div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((a, o) => a + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const activeWilayas = new Set(orders.map((o) => o.wilaya)).size;

  return (
    <div className="wrap" style={{ paddingBottom: 90 }}>
      <div className="admin-bar">
        <h1 className="display" style={{ fontSize: 32 }}>{t("admin_dashboard")}</h1>
        <button className="btn btn-outline" onClick={() => setAuthed(false)}>← Logout</button>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="v">{orders.length}</div><div className="l">{t("admin_stats_orders")}</div></div>
        <div className="stat-card"><div className="v">{money(totalRevenue)}</div><div className="l">{t("admin_stats_revenue")}</div></div>
        <div className="stat-card"><div className="v">{pendingCount}</div><div className="l">{t("admin_stats_pending")}</div></div>
        <div className="stat-card"><div className="v">{activeWilayas}</div><div className="l">{t("admin_stats_wilayas")}</div></div>
      </div>

      <div className="admin-tabs">
        {(["orders", "products", "newarrivals", "promotions", "shipping", "content", "landing"] as const).map((key) => (
          <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
            {key === "orders" ? t("admin_orders") : key === "products" ? t("admin_products") : key === "newarrivals" ? "Nouveautés" : key === "promotions" ? "Promos" : key === "shipping" ? t("admin_shipping") : key === "landing" ? "Page d'accueil" : t("admin_content")}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        orders.length === 0 ? <p style={{ color: "var(--steel)" }}>{t("admin_no_orders")}</p> :
        <table>
          <thead><tr><th>Ref</th><th>Client</th><th>Wilaya</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <>
                <tr key={o.id} onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} style={{ cursor: "pointer" }}>
                  <td className="mono">{o.id}</td>
                  <td>{o.name}<br /><span style={{ color: "var(--steel)", fontSize: 11.5 }}>{o.phone}</span></td>
                  <td>{o.wilaya}</td>
                  <td className="mono">{money(o.total)}</td>
                  <td><span className={`status-pill ${o.status}`}>{o.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      {o.status === "pending" && <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); toggleOrderStatus(o.id, "confirmed"); }}>{t("admin_confirm")}</button>}
                      {o.status === "confirmed" && <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); toggleOrderStatus(o.id, "shipped"); }}>{t("admin_ship")}</button>}
                      {o.status === "shipped" && <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); toggleOrderStatus(o.id, "delivered"); }}>{t("admin_deliver")}</button>}
                      {(o.status === "pending" || o.status === "confirmed") && <button className="btn btn-sm" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--steel)" }} onClick={e => { e.stopPropagation(); toggleOrderStatus(o.id, "cancelled"); }}>{t("admin_cancel_order")}</button>}
                    </div>
                  </td>
                </tr>
                {expandedOrder === o.id && (
                  <tr key={`${o.id}-detail`}>
                    <td colSpan={6} style={{ padding: "0 12px 16px" }}>
                      <div style={{ background: "var(--ink)", border: "1px solid var(--line)", borderRadius: 2, padding: 16, marginTop: 4 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13, marginBottom: 14 }}>
                          <div><span style={{ color: "var(--steel)" }}>Address:</span> {o.address}, {o.commune}, {o.wilaya}</div>
                          <div><span style={{ color: "var(--steel)" }}>Delivery:</span> {o.deliveryType === "home" ? "Home" : "Stopdesk"}</div>
                          <div><span style={{ color: "var(--steel)" }}>Subtotal:</span> {money(o.subtotal)}</div>
                          <div><span style={{ color: "var(--steel)" }}>Shipping:</span> {o.shippingCost === 0 ? "Free" : money(o.shippingCost)}</div>
                          {o.procolisId && <div><span style={{ color: "var(--steel)" }}>Tracking:</span> {o.procolisId}</div>}
                        </div>
                        <table style={{ fontSize: 12 }}>
                          <thead><tr><th style={{ padding: "6px 8px" }}>Product</th><th style={{ padding: "6px 8px" }}>Brand</th><th style={{ padding: "6px 8px" }}>Size</th><th style={{ padding: "6px 8px" }}>Color</th><th style={{ padding: "6px 8px" }}>Qty</th><th style={{ padding: "6px 8px" }}>Price</th></tr></thead>
                          <tbody>
                            {o.items.map((item, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "6px 8px" }}>{item.productName}</td>
                                <td style={{ padding: "6px 8px", color: "var(--steel)" }}>{item.brand}</td>
                                <td style={{ padding: "6px 8px" }}>{item.size}</td>
                                <td style={{ padding: "6px 8px" }}>{item.color}</td>
                                <td style={{ padding: "6px 8px" }}>{item.quantity}</td>
                                <td style={{ padding: "6px 8px" }} className="mono">{money(item.price)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}

      {tab === "products" && (
        <>
          <div style={{ marginBottom: 16 }}>
            <button className="btn btn-primary" onClick={() => { setShowNewForm(!showNewForm); setEditingProduct(null); }}>
              {showNewForm ? "− " + t("admin_cancel") : t("admin_new_product")}
            </button>
          </div>
          {showNewForm && <ProductFormInner product={EMPTY_PRODUCT} onSave={saveProduct} onCancel={() => setShowNewForm(false)} showToast={showToast} saving={saving} />}
          {editingProduct && <ProductFormInner product={editingProduct} onSave={saveProduct} onCancel={() => setEditingProduct(null)} showToast={showToast} saving={saving} />}
          <table>
            <thead><tr><th></th><th>Name</th><th>Brand</th><th>Price</th><th>Stock</th><th>Active</th><th></th></tr></thead>
            <tbody>
              {[...products].sort((a, b) => a.position - b.position).map((p) => {
                const totalStock = p.variants.reduce((a, v) => a + v.stock, 0);
                return (
                  <tr key={p.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="btn btn-sm" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--steel)", padding: "2px 6px", fontSize: 11 }} onClick={() => moveProduct(p.id, "up")}>▲</button>
                      <button className="btn btn-sm" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--steel)", padding: "2px 6px", fontSize: 11, marginLeft: 4 }} onClick={() => moveProduct(p.id, "down")}>▼</button>
                      <span className="mono" style={{ fontSize: 10, color: "var(--steel)", marginLeft: 6 }}>{p.position}</span>
                    </td>
                    <td>{p.name}<br /><span className="mono" style={{ color: "var(--steel)", fontSize: 11 }}>{p.sku}</span></td>
                    <td>{p.brand}</td>
                    <td className="mono">{money(p.price)}</td>
                    <td className="mono">{totalStock}</td>
                    <td><span className={`status-pill ${p.active ? "confirmed" : "cancelled"}`}>{p.active ? "Active" : "Hidden"}</span></td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => { setEditingProduct(p); setShowNewForm(false); }}>{t("admin_edit")}</button>
                      <button className="btn btn-outline btn-sm" onClick={() => toggleProductActive(p.id, p.active)}>{p.active ? t("admin_hide") : t("admin_show")}</button>
                      <button className="btn btn-sm" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--steel)" }} onClick={() => deleteProduct(p.id)}>{t("admin_del")}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {tab === "shipping" && (
        <>
          <p style={{ color: "var(--steel)", fontSize: 12.5, marginBottom: 16 }}>Edit home/stopdesk price per wilaya. Saved and used immediately.</p>
          <table>
            <thead><tr><th>Wilaya</th><th>Home (DA)</th><th>Stopdesk (DA)</th><th>Days</th></tr></thead>
            <tbody>
              {rates.map((r, i) => (
                <tr key={r.wilaya}>
                  <td>{r.wilaya}</td>
                  <td><input type="number" className="wtable" value={r.homePrice} onChange={(e) => {
                    const newRates = [...rates]; newRates[i] = { ...newRates[i], homePrice: +e.target.value }; setRates(newRates);
                  }} /></td>
                  <td><input type="number" className="wtable" value={r.stopPrice} onChange={(e) => {
                    const newRates = [...rates]; newRates[i] = { ...newRates[i], stopPrice: +e.target.value }; setRates(newRates);
                  }} /></td>
                  <td className="mono" style={{ color: "var(--steel)", fontSize: 11.5 }}>{r.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={saveRates}>Save Rates</button>
        </>
      )}

      {tab === "newarrivals" && <AdminSlides section="new_arrival" />}
      {tab === "promotions" && <AdminSlides section="promotion" />}
      {tab === "landing" && <AdminLanding />}
      {tab === "content" && <AdminContent />}

      <div className={`toast ${toastMsg ? "show" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        <span>{toastMsg}</span>
      </div>
    </div>
  );
}

"use client";

import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LangContext";
import { useRouter } from "next/navigation";

export default function CartDrawer({ show, onClose }: { show: boolean; onClose: () => void }) {
  const { items, changeQty, removeItem, subtotal } = useCart();
  const { t } = useLang();
  const router = useRouter();

  return (
    <>
      <div className={`overlay ${show ? "show" : ""}`} onClick={onClose} />
      <div className={`drawer ${show ? "show" : ""}`}>
        <div className="drawer-head">
          <h3>{t("your_cart")}</h3>
          <button className="icon-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              <p>{t("cart_empty")}</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variantId} className="cart-line">
                <div className="cart-thumb">
                  <svg viewBox="0 0 200 130" width="60%" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M10 95c0-8 8-14 18-16 12-2 20-10 30-14 14-6 30-6 42 2 6 4 10 4 18 2 14-4 30 0 42 10 8 6 12 8 20 8 6 0 8 4 8 8v8c0 4-3 7-7 7H17c-4 0-7-3-7-7v-8z" />
                  </svg>
                </div>
                <div className="cart-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">{item.brand} · {item.color} · {item.size}</div>
                  <div className="cart-item-price">{money(item.price)}</div>
                  <div className="qty-row">
                    <button onClick={() => changeQty(item.variantId, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQty(item.variantId, 1)}>+</button>
                  </div>
                  <button className="rm-btn" onClick={() => removeItem(item.variantId)}>{t("cart_remove")}</button>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="sum-row total">
              <span>{t("subtotal")}</span>
              <span className="mono">{money(subtotal)}</span>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => { onClose(); router.push("/checkout"); }}
            >
              {t("checkout_btn")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function money(n: number) {
  return n.toLocaleString("fr-FR") + " DA";
}

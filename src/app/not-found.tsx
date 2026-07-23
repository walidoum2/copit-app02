"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";

export default function NotFound() {
  const { lang } = useLang();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
      <div className="mono" style={{ fontSize: 80, fontWeight: 700, color: "var(--cop)", lineHeight: 1 }}>
        404
      </div>
      <h1 className="display" style={{ fontSize: "clamp(28px, 5vw, 44px)", marginTop: 16, textTransform: "uppercase" }}>
        {lang === "ar" ? "الصفحة غير موجودة" : "Page introuvable"}
      </h1>
      <p style={{ color: "var(--steel)", fontSize: 15, marginTop: 10, maxWidth: 400, lineHeight: 1.6 }}>
        {lang === "ar" ? "هاد الصفحة ماشي موجودة. يمكن الرابط غالط ولا المنتج تحذف." : "Cette page n'existe pas ou a été déplacée."}
      </p>
      <Link href="/" className="btn btn-primary" style={{ marginTop: 30, textDecoration: "none" }}>
        {lang === "ar" ? "العودة للرئيسية" : "Retour à l'accueil"}
      </Link>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LangContext";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = useLang();

  useEffect(() => { console.error(error); }, [error]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
      <div className="text-price" style={{ fontSize: 60, color: "var(--cop-dim)", lineHeight: 1 }}>
        Oops
      </div>
      <h1 className="text-heading" style={{ fontSize: "clamp(24px, 4vw, 36px)" }}>
        {lang === "ar" ? "حدث خطأ ما" : "Quelque chose s'est mal passé"}
      </h1>
      <p style={{ color: "var(--steel)", fontSize: 15, marginTop: 10, maxWidth: 420, lineHeight: 1.6 }}>
        {lang === "ar" ? "حدث خطأ غير متوقع. حاول مرة أخرى أو عد للرئيسية." : "Une erreur inattendue s'est produite. Essaie de recharger ou reviens à l'accueil."}
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
        <button onClick={reset} className="btn btn-primary">
          {lang === "ar" ? "حاول مرة أخرى" : "Réessayer"}
        </button>
        <Link href="/" className="btn btn-outline" style={{ textDecoration: "none" }}>
          {lang === "ar" ? "العودة للرئيسية" : "Accueil"}
        </Link>
      </div>
    </div>
  );
}

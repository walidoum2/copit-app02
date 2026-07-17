"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Lang, DICT } from "@/data/dictionary";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LangContext = createContext<LangContextType>({
  lang: "fr",
  setLang: () => {},
  t: (k) => k,
  dir: "ltr",
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.body.classList.toggle("lang-ar", l === "ar");
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, []);

  const t = useCallback(
    (key: string): string => DICT[lang]?.[key] || DICT.fr[key] || DICT.en?.[key] || key,
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

"use client";

import { type ReactNode } from "react";
import { LangProvider } from "@/contexts/LangContext";
import { CartProvider } from "@/contexts/CartContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <CartProvider>{children}</CartProvider>
    </LangProvider>
  );
}

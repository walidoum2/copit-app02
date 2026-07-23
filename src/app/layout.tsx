import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = "https://copit.dz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "COP IT — Sneakers & Streetwear, Algérie",
  description: "Sneakers et streetwear 100% originaux, livrés dans les 69 wilayas. Paiement à la livraison.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "COP IT — Sneakers & Streetwear, Algérie",
    description: "Sneakers et streetwear 100% originaux, livrés dans les 69 wilayas. Paiement à la livraison.",
    url: siteUrl,
    siteName: "COP IT DZ",
    locale: "fr_DZ",
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "COP IT — Sneakers & Streetwear, Algérie",
    description: "Sneakers et streetwear 100% originaux, livrés dans les 69 wilayas. Paiement à la livraison.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

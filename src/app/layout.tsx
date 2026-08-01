import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = "https://copit.dz";
const siteDescription = "Sneakers et streetwear premium, livrés dans les 69 wilayas d'Algérie. Paiement à la livraison.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "COP IT — Sneakers & Streetwear, Algérie",
  description: siteDescription,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "COP IT — Sneakers & Streetwear, Algérie",
    description: siteDescription,
    url: siteUrl,
    siteName: "COP IT DZ",
    locale: "fr_DZ",
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "COP IT — Sneakers & Streetwear, Algérie",
    description: siteDescription,
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

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://copit.dz";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/checkout`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/track`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/vip`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/shipping`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/conditions`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];
}

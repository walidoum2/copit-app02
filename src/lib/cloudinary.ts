const CLOUDINARY_RE = /^https?:\/\/res\.cloudinary\.com\/.+\/image\/upload\//;

export function optimizeCldUrl(url: string, opts?: { w?: number; q?: string; f?: string }): string {
  if (!CLOUDINARY_RE.test(url)) return url;
  const { w, q = "auto", f = "auto" } = opts || {};
  const parts = url.split("/image/upload/");
  if (parts.length !== 2) return url;
  const params = [`f_${f}`, `q_${q}`];
  if (w) params.push(`w_${w}`);
  return `${parts[0]}/image/upload/${params.join(",")}/${parts[1]}`;
}

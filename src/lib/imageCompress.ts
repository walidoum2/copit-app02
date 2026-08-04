export interface CompressedImage {
  blob: Blob;
  type: string;
  name: string;
}

const SMALL_PASSTHROUGH = 350 * 1024;
const MAX_DIM = 1600;
const QUALITY = 0.85;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode-failed"));
    img.src = url;
  });
}

export async function compressImageFile(file: File): Promise<CompressedImage | null> {
  const passthrough = ["image/jpeg", "image/png", "image/webp"];
  if (file.size <= SMALL_PASSTHROUGH && passthrough.includes(file.type)) {
    return { blob: file, type: file.type, name: file.name };
  }

  try {
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);

      let blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
      let type = "image/webp";
      if (!blob) {
        blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
        type = "image/jpeg";
      }
      if (!blob) return null;

      const name = file.name.replace(/\.[^.]+$/, "") + (type === "image/webp" ? ".webp" : ".jpg");
      return { blob, type, name };
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return null;
  }
}

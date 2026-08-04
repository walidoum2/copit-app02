import { createHash } from "crypto";
import { readFileSync } from "fs";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);
const dataUrl = `data:image/png;base64,${png.toString("base64")}`;
const timestamp = Math.round(Date.now() / 1000);
const signature = createHash("sha1")
  .update(`folder=copit/products&timestamp=${timestamp}${apiSecret}`)
  .digest("hex");

console.log("cloud:", cloudName, "| key:", apiKey ? apiKey.slice(0, 6) + "..." : "MISSING", "| secret:", apiSecret ? apiSecret.slice(0, 4) + "..." : "MISSING");

const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ file: dataUrl, folder: "copit/products", timestamp, api_key: apiKey, signature }),
});
const body = await res.text();
console.log("Cloudinary status:", res.status);
console.log("Cloudinary response:", body.slice(0, 400));

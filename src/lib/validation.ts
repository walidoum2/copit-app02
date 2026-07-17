import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().min(2, "Name too short").max(100),
  phone: z
    .string()
    .regex(/^0[5-7]\d{8}$/, "Invalid Algerian phone number"),
  wilaya: z.string().min(2),
  commune: z.string().min(2),
  address: z.string().min(5, "Address too short").max(300),
  notes: z.string().max(500).optional(),
  deliveryType: z.enum(["home", "stopdesk"]),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        size: z.string(),
        color: z.string(),
        price: z.number().int().positive(),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1, "At least one item required"),
  subtotal: z.number().int().positive(),
  shippingCost: z.number().int().min(0),
  total: z.number().int().positive(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  brand: z.string().min(1).max(100),
  category: z.string().min(1),
  price: z.number().int().positive(),
  originalPrice: z.number().int().positive(),
  material: z.string().min(1).max(200),
  sku: z.string().min(1).max(50),
  tag: z.string().max(100).optional(),
  active: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
  variants: z
    .array(
      z.object({
        size: z.string(),
        color: z.string(),
        colorHex: z.string(),
        stock: z.number().int().min(0),
      })
    )
    .min(1),
  images: z.array(z.string()).optional(),
});

export const shippingRateSchema = z.object({
  wilaya: z.string(),
  homePrice: z.number().int().min(0),
  stopPrice: z.number().int().min(0),
  days: z.string(),
});

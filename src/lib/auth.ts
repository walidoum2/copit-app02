import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required. Set it in .env");
}
const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AdminPayload {
  id: string;
  email: string;
}

export async function verifyAdmin(
  email: string,
  password: string
): Promise<AdminPayload | null> {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return null;

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return null;

  return { id: admin.id, email: admin.email };
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/copit_admin_token=([^;]+)/);
  return match ? match[1] : null;
}

export async function getAuthAdmin(
  request: Request
): Promise<AdminPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

import type { NextApiRequest, NextApiResponse } from "next";
import { eq, or } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { formBody } from "@/lib/request";
import { memberSchema, parseForm } from "@/lib/validation";
import { redirectWithMessage, requireApiSession } from "@/server/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res, "admin");
  if (!session) return;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(memberSchema, formBody(req));
  if (!parsed.data || !parsed.data.password) {
    redirectWithMessage(res, "/admin/members", parsed.error ?? "Password anggota baru wajib diisi.");
    return;
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.email, parsed.data.email), eq(users.username, parsed.data.username || "")))
    .limit(1);

  if (existing) {
    redirectWithMessage(res, "/admin/members", "Email atau username sudah digunakan.");
    return;
  }

  await db.insert(users).values({
    name: parsed.data.name,
    email: parsed.data.email,
    username: parsed.data.username || null,
    passwordHash: hashPassword(parsed.data.password),
    phone: parsed.data.phone || null,
    role: parsed.data.role,
    isActive: parsed.data.isActive,
  });

  redirectWithMessage(res, "/admin/members", "Anggota berhasil ditambahkan.");
}

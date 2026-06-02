import type { NextApiRequest, NextApiResponse } from "next";
import { eq } from "drizzle-orm";
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

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    redirectWithMessage(res, "/admin/members", "ID anggota tidak valid.");
    return;
  }

  const body = formBody(req);
  const parsed = parseForm(memberSchema, {
    ...body,
    isActive: body.isActive === "on" || body.isActive === "true",
  });
  if (!parsed.data) {
    redirectWithMessage(res, "/admin/members", parsed.error ?? "Data anggota tidak valid.");
    return;
  }

  await db
    .update(users)
    .set({
      name: parsed.data.name,
      email: parsed.data.email,
      username: parsed.data.username || null,
      phone: parsed.data.phone || null,
      role: parsed.data.role,
      isActive: parsed.data.isActive,
      ...(parsed.data.password ? { passwordHash: hashPassword(parsed.data.password) } : {}),
      updatedAt: new Date(),
    })
    .where(eq(users.id, id));

  redirectWithMessage(res, "/admin/members", "Anggota berhasil diperbarui.");
}

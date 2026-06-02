import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { comments } from "@/db/schema";
import { formBody } from "@/lib/request";
import { commentSchema, parseForm } from "@/lib/validation";
import { redirectWithMessage, requireApiSession } from "@/server/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res, "admin");
  if (!session) return;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(commentSchema, formBody(req));
  if (!parsed.data) {
    redirectWithMessage(res, "/admin/monitorings", parsed.error ?? "Komentar tidak valid.");
    return;
  }

  await db.insert(comments).values({
    monitoringId: parsed.data.monitoringId,
    adminId: session.id,
    comment: parsed.data.comment,
  });

  redirectWithMessage(res, `/monitorings/${parsed.data.monitoringId}`, "Komentar berhasil ditambahkan.");
}

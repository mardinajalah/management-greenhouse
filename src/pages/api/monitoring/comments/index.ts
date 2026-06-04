import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { monitoringComments } from "@/db/schema";
import { monitoringDetailPath, type MonitoringModule } from "@/lib/monitoring-modules";
import { formBody } from "@/lib/request";
import { monitoringCommentSchema, parseForm } from "@/lib/validation";
import { redirectWithMessage, requireApiSession } from "@/server/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res, "admin");
  if (!session) return;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(monitoringCommentSchema, formBody(req));
  if (!parsed.data) {
    redirectWithMessage(res, "/admin/monitorings", parsed.error ?? "Komentar tidak valid.");
    return;
  }

  const module = parsed.data.module as MonitoringModule;
  const recordId = parsed.data.recordId;

  await db.insert(monitoringComments).values({
    module,
    recordId,
    adminId: session.id,
    comment: parsed.data.comment,
  });

  redirectWithMessage(
    res,
    monitoringDetailPath(module, recordId),
    "Komentar berhasil ditambahkan.",
  );
}

import type { NextApiRequest, NextApiResponse } from "next";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { pleningSchedules } from "@/db/schema";
import { canCompletePlening } from "@/lib/plening";
import { formBody } from "@/lib/request";
import { parseForm, pleningFinishSchema } from "@/lib/validation";
import { monitoringDetailPath } from "@/lib/monitoring-modules";
import { syncDuePleningStatuses } from "@/lib/monitoring-data";
import { redirectWithMessage, requireApiSession } from "@/server/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res, "user");
  if (!session) return;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(pleningFinishSchema, { ...formBody(req), id: req.query.id });
  if (!parsed.data) {
    redirectWithMessage(res, "/user/monitorings/plening", parsed.error ?? "Data tidak valid.");
    return;
  }

  await syncDuePleningStatuses();

  const [row] = await db
    .select()
    .from(pleningSchedules)
    .where(and(eq(pleningSchedules.id, parsed.data.id), eq(pleningSchedules.userId, session.id)))
    .limit(1);

  if (!row) {
    redirectWithMessage(res, "/user/monitorings/plening", "Jadwal plening tidak ditemukan.");
    return;
  }

  if (!canCompletePlening(row.pleningDate, row.status)) {
    redirectWithMessage(
      res,
      "/user/monitorings/plening",
      "Plening belum bisa diselesaikan. Tunggu notifikasi pada tanggal plening.",
    );
    return;
  }

  await db
    .update(pleningSchedules)
    .set({ status: "selesai", updatedAt: new Date() })
    .where(eq(pleningSchedules.id, parsed.data.id));

  redirectWithMessage(
    res,
    monitoringDetailPath("plening", parsed.data.id),
    "Plening ditandai selesai.",
  );
}

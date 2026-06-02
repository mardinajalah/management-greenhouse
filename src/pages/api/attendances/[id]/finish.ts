import type { NextApiRequest, NextApiResponse } from "next";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { attendances } from "@/db/schema";
import { formBody } from "@/lib/request";
import { finishAttendanceSchema, parseForm } from "@/lib/validation";
import { redirectWithMessage, requireApiSession } from "@/server/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res, "user");
  if (!session) return;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(finishAttendanceSchema, { ...formBody(req), id: req.query.id });
  if (!parsed.data) {
    redirectWithMessage(res, "/user/attendances", parsed.error ?? "Data jam keluar tidak valid.");
    return;
  }

  const [attendance] = await db
    .select()
    .from(attendances)
    .where(and(eq(attendances.id, parsed.data.id), eq(attendances.userId, session.id)))
    .limit(1);

  if (!attendance || parsed.data.checkOutTime < attendance.checkInTime) {
    redirectWithMessage(res, "/user/attendances", "Jam keluar tidak boleh lebih awal dari jam masuk.");
    return;
  }

  await db
    .update(attendances)
    .set({
      checkOutTime: parsed.data.checkOutTime,
      status: "selesai",
      updatedAt: new Date(),
    })
    .where(and(eq(attendances.id, parsed.data.id), eq(attendances.userId, session.id)));

  redirectWithMessage(res, "/user/attendances", "Presensi berhasil diselesaikan.");
}

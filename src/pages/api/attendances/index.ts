import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { attendances } from "@/db/schema";
import { formBody } from "@/lib/request";
import { attendanceSchema, parseForm } from "@/lib/validation";
import { redirectWithMessage, requireApiSession } from "@/server/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res, "user");
  if (!session) return;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(attendanceSchema, formBody(req));
  if (!parsed.data) {
    redirectWithMessage(res, "/user/attendances/new", parsed.error ?? "Data presensi tidak valid.");
    return;
  }

  await db.insert(attendances).values({
    userId: session.id,
    attendanceDate: parsed.data.attendanceDate,
    workTitle: parsed.data.workTitle,
    workDescription: parsed.data.workDescription || null,
    checkInTime: parsed.data.checkInTime,
    checkOutTime: parsed.data.checkOutTime || null,
    status: parsed.data.status,
    note: parsed.data.note || null,
  });

  redirectWithMessage(res, "/user/attendances", "Presensi berhasil disimpan.");
}

import type { NextApiRequest, NextApiResponse } from "next";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { pleningSchedules } from "@/db/schema";
import { todayDateString } from "@/lib/plening";
import { formBody } from "@/lib/request";
import { pleningScheduleSchema, parseForm } from "@/lib/validation";
import { redirectWithMessage, requireApiSession } from "@/server/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res, "user");
  if (!session) return;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(pleningScheduleSchema, formBody(req));
  if (!parsed.data) {
    redirectWithMessage(res, "/user/monitorings/plening/new", parsed.error ?? "Data tidak valid.");
    return;
  }

  const existing = await db
    .select()
    .from(pleningSchedules)
    .where(
      and(
        eq(pleningSchedules.pleningDate, parsed.data.pleningDate),
        eq(pleningSchedules.roomNumber, parsed.data.roomNumber),
        eq(pleningSchedules.pleningType, parsed.data.pleningType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    redirectWithMessage(
      res,
      "/user/monitorings/plening/new",
      `Jadwal plening dengan jenis tersebut sudah terdaftar untuk Ruangan ${parsed.data.roomNumber} pada tanggal ${parsed.data.pleningDate}.`
    );
    return;
  }

  const today = todayDateString();
  const status = parsed.data.pleningDate <= today ? "siap" : "menunggu";

  await db.insert(pleningSchedules).values({
    userId: session.id,
    pleningDate: parsed.data.pleningDate,
    roomNumber: parsed.data.roomNumber,
    pleningType: parsed.data.pleningType,
    status,
  });

  redirectWithMessage(res, "/user/monitorings/plening", "Jadwal plening berhasil dibuat.");
}

import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { waterConditions } from "@/db/schema";
import { formBody } from "@/lib/request";
import { waterConditionSchema, parseForm } from "@/lib/validation";
import { redirectWithMessage, requireApiSession } from "@/server/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res, "user");
  if (!session) return;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(waterConditionSchema, formBody(req));
  if (!parsed.data) {
    redirectWithMessage(res, "/user/monitorings/water/new", parsed.error ?? "Data tidak valid.");
    return;
  }

  await db.insert(waterConditions).values({
    userId: session.id,
    recordDate: parsed.data.recordDate,
    roomNumber: parsed.data.roomNumber,
    initialPpm: parsed.data.initialPpm,
    nutrientMl: String(parsed.data.nutrientMl),
    finalPpm: parsed.data.finalPpm,
    initialPh: String(parsed.data.initialPh),
    phDownMl: String(parsed.data.phDownMl),
    finalPh: String(parsed.data.finalPh),
    waterTemperature: String(parsed.data.waterTemperature),
  });

  redirectWithMessage(res, "/user/monitorings/water", "Kondisi air berhasil disimpan.");
}

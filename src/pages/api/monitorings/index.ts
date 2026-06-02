import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { db } from "@/db/client";
import { greenhouseMonitorings, monitoringPhotos } from "@/db/schema";
import { formBody } from "@/lib/request";
import { monitoringSchema, parseForm } from "@/lib/validation";
import { redirectWithMessage, requireApiSession } from "@/server/api";

const MAX_PHOTO_SIZE = 2 * 1024 * 1024;
const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res, "user");
  if (!session) return;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(monitoringSchema, formBody(req));
  if (!parsed.data) {
    redirectWithMessage(res, "/user/monitorings/new", parsed.error ?? "Data monitoring tidak valid.");
    return;
  }

  const extension = allowedTypes[parsed.data.photoType];
  if (!extension) {
    redirectWithMessage(res, "/user/monitorings/new", "Tipe foto harus JPG, PNG, atau WEBP.");
    return;
  }

  const base64 = parsed.data.photoData.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  if (buffer.byteLength > MAX_PHOTO_SIZE) {
    redirectWithMessage(res, "/user/monitorings/new", "Ukuran foto maksimal 2MB.");
    return;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "greenhouse");
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const photoUrl = `/uploads/greenhouse/${filename}`;
  await writeFile(path.join(uploadDir, filename), buffer);

  await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(greenhouseMonitorings)
      .values({
        userId: session.id,
        monitoringDate: parsed.data.monitoringDate,
        waterCondition: parsed.data.waterCondition,
        waterPh: String(parsed.data.waterPh),
        waterTemperature: String(parsed.data.waterTemperature),
        airTemperature: String(parsed.data.airTemperature),
        humidity: String(parsed.data.humidity),
        plantCondition: parsed.data.plantCondition,
        pestCondition: parsed.data.pestCondition,
        notes: parsed.data.notes || null,
      })
      .$returningId();

    await tx.insert(monitoringPhotos).values({
      monitoringId: created.id,
      photoUrl,
      caption: parsed.data.caption || parsed.data.photoName,
    });
  });

  redirectWithMessage(res, "/user/monitorings", "Monitoring greenhouse berhasil disimpan.");
}

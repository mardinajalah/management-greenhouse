import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { plantConditions } from "@/db/schema";
import { formBody } from "@/lib/request";
import { parseImageUpload, saveUploadedImage } from "@/lib/upload-image";
import { plantConditionSchema, parseForm } from "@/lib/validation";
import { redirectWithMessage, requireApiSession } from "@/server/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res, "user");
  if (!session) return;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(plantConditionSchema, formBody(req));
  if (!parsed.data) {
    redirectWithMessage(res, "/user/monitorings/plants/new", parsed.error ?? "Data tidak valid.");
    return;
  }

  const photo = parseImageUpload(parsed.data.photoData, parsed.data.photoType);
  if ("error" in photo) {
    redirectWithMessage(res, "/user/monitorings/plants/new", photo.error);
    return;
  }

  const photoUrl = await saveUploadedImage(photo.buffer, photo.extension, "plants");

  await db.insert(plantConditions).values({
    userId: session.id,
    recordDate: parsed.data.recordDate,
    plantType: parsed.data.plantType,
    description: parsed.data.description,
    plantAge: parsed.data.plantAge,
    photoUrl,
  });

  redirectWithMessage(res, "/user/monitorings/plants", "Kondisi tanaman berhasil disimpan.");
}

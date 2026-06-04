import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function parseImageUpload(photoData: string, photoType: string) {
  const extension = allowedTypes[photoType];
  if (!extension) {
    return { error: "Tipe foto harus JPG, PNG, atau WEBP." as const };
  }

  const base64 = photoData.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  if (buffer.byteLength > MAX_IMAGE_SIZE) {
    return { error: "Ukuran foto maksimal 2MB." as const };
  }

  return { buffer, extension };
}

export async function saveUploadedImage(buffer: Buffer, extension: string, folder: string) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const photoUrl = `/uploads/${folder}/${filename}`;
  await writeFile(path.join(uploadDir, filename), buffer);

  return photoUrl;
}

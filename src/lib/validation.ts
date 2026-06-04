import { z } from "zod";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam harus HH:mm");
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD");

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email atau username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const memberSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  username: z.string().trim().optional().or(z.literal("")),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  role: z.enum(["admin", "user"]),
  isActive: z.coerce.boolean().default(true),
});

export const setupAdminSchema = memberSchema.extend({
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.literal("admin").default("admin"),
});

export const attendanceSchema = z
  .object({
    attendanceDate: dateSchema,
    workTitle: z.string().min(3, "Nama pekerjaan minimal 3 karakter"),
    workDescription: z.string().optional().or(z.literal("")),
    checkInTime: timeSchema,
    checkOutTime: timeSchema.optional().or(z.literal("")),
    status: z.enum(["sedang_dikerjakan", "selesai", "izin", "sakit", "alpha"]),
    photoData: z.string().optional().or(z.literal("")),
    photoName: z.string().optional().or(z.literal("")),
    photoType: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => !data.checkOutTime || data.checkOutTime >= data.checkInTime,
    "Jam keluar tidak boleh lebih awal dari jam masuk",
  )
  .refine(
    (data) => {
      if (!data.photoData) return true;
      return Boolean(data.photoName && data.photoType?.startsWith("image/"));
    },
    { message: "Data foto tidak lengkap atau format tidak valid." },
  );

export const finishAttendanceSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    checkOutTime: timeSchema,
  })
  .passthrough();

const requiredPhotoSchema = z.object({
  photoData: z.string().min(1, "Foto wajib diunggah"),
  photoName: z.string().min(1),
  photoType: z.string().startsWith("image/", "File harus berupa gambar"),
});

export const plantConditionSchema = z
  .object({
    recordDate: dateSchema,
    plantType: z.string().min(2, "Jenis tanaman minimal 2 karakter"),
    description: z.string().min(2, "Deskripsi wajib diisi"),
    plantAge: z.string().min(1, "Usia tanaman wajib diisi"),
  })
  .extend(requiredPhotoSchema.shape);

export const waterConditionSchema = z.object({
  recordDate: dateSchema,
  roomNumber: z.coerce.number().int().min(1, "Ruangan wajib diisi"),
  initialPpm: z.coerce.number().int().min(150).max(3000),
  nutrientMl: z.coerce.number().min(0),
  finalPpm: z.coerce.number().int().min(150).max(3000),
  initialPh: z.coerce.number().min(1).max(10),
  phDownMl: z.coerce.number().min(0),
  finalPh: z.coerce.number().min(1).max(10),
  waterTemperature: z.coerce.number().min(10).max(40),
});

export const pleningScheduleSchema = z.object({
  pleningDate: dateSchema,
  roomNumber: z.coerce.number().int().min(1, "Ruangan wajib diisi"),
  pleningType: z.enum(["sprei_hama", "sprei_penyakit", "polinasi", "wiwil", "panen"]),
});

export const pleningFinishSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const monitoringCommentSchema = z.object({
  module: z.enum(["plant", "water", "plening"]),
  recordId: z.coerce.number().int().positive(),
  comment: z.string().min(2, "Komentar minimal 2 karakter"),
});

export function parseForm<T extends z.ZodTypeAny>(schema: T, data: unknown) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { data: result.data as z.infer<T>, error: null };
  }

  return {
    data: null,
    error: result.error.issues.map((issue) => issue.message).join(", "),
  };
}

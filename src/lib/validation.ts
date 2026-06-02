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
    note: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => !data.checkOutTime || data.checkOutTime >= data.checkInTime,
    "Jam keluar tidak boleh lebih awal dari jam masuk",
  );

export const finishAttendanceSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    checkOutTime: timeSchema,
  })
  .passthrough();

export const monitoringSchema = z.object({
  monitoringDate: dateSchema,
  waterCondition: z.string().min(2, "Kondisi air wajib diisi"),
  waterPh: z.coerce.number().min(0).max(14),
  waterTemperature: z.coerce.number(),
  airTemperature: z.coerce.number(),
  humidity: z.coerce.number().min(0).max(100),
  plantCondition: z.string().min(2, "Kondisi tanaman wajib diisi"),
  pestCondition: z.string().min(2, "Kondisi hama wajib diisi"),
  notes: z.string().optional().or(z.literal("")),
  photoData: z.string().min(1, "Foto dokumentasi wajib diunggah"),
  photoName: z.string().min(1),
  photoType: z.string().startsWith("image/", "File harus berupa gambar"),
  caption: z.string().optional().or(z.literal("")),
});

export const commentSchema = z.object({
  monitoringId: z.coerce.number().int().positive(),
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

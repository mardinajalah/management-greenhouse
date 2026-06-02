import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.preprocess(
    (value) => (value === "" || value == null ? "mysql://root:root@localhost:3306/greenhouse_dashboard" : value),
    z.string().min(1, "DATABASE_URL wajib diisi"),
  ),
  SESSION_SECRET: z.preprocess(
    (value) => (value === "" || value == null ? "greenhouse-local-session-secret" : value),
    z.string().min(16, "SESSION_SECRET minimal 16 karakter"),
  ),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
});

import type { NextApiRequest, NextApiResponse } from "next";
import { eq, or } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { setSessionCookie } from "@/lib/session";
import { verifyPassword } from "@/lib/password";
import { formBody } from "@/lib/request";
import { loginSchema, parseForm } from "@/lib/validation";
import { redirectWithMessage } from "@/server/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const parsed = parseForm(loginSchema, formBody(req));
  if (!parsed.data) {
    redirectWithMessage(res, "/login", parsed.error ?? "Data login tidak valid.");
    return;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, parsed.data.identifier), eq(users.username, parsed.data.identifier)))
    .limit(1);

  if (!user || !user.isActive) {
    redirectWithMessage(res, "/login", "identifier_error");
    return;
  }

  if (!verifyPassword(parsed.data.password, user.passwordHash)) {
    redirectWithMessage(res, "/login", "password_error");
    return;
  }

  setSessionCookie(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  res.redirect(303, user.role === "admin" ? "/admin" : "/user");
}

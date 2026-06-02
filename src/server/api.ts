import type { NextApiRequest, NextApiResponse } from "next";
import { getSessionFromRequest, type SessionUser } from "@/lib/session";

export function requireApiSession(
  req: NextApiRequest,
  res: NextApiResponse,
  role?: SessionUser["role"],
) {
  const user = getSessionFromRequest(req);
  if (!user) {
    res.status(401).json({ message: "Anda harus login terlebih dahulu." });
    return null;
  }

  if (role && user.role !== role) {
    res.status(403).json({ message: "Anda tidak memiliki akses ke fitur ini." });
    return null;
  }

  return user;
}

export function redirectWithMessage(res: NextApiResponse, target: string, message?: string) {
  const url = new URL(target, "http://localhost");
  if (message) url.searchParams.set("message", message);
  res.redirect(303, `${url.pathname}${url.search}`);
}

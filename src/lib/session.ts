import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { createHmac, timingSafeEqual } from "crypto";
import { env } from "@/lib/env";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

const COOKIE_NAME = "greenhouse_session";
const MAX_AGE = 60 * 60 * 24 * 7;

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string) {
  return createHmac("sha256", env.SESSION_SECRET).update(payload).digest("base64url");
}

export function createSessionToken(user: SessionUser) {
  const payload = toBase64Url(JSON.stringify({ ...user, exp: Date.now() + MAX_AGE * 1000 }));
  return `${payload}.${sign(payload)}`;
}

export function parseSessionToken(token?: string): SessionUser | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const decoded = JSON.parse(fromBase64Url(payload)) as SessionUser & { exp: number };
    if (decoded.exp < Date.now()) return null;
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextApiRequest | GetServerSidePropsContext["req"]) {
  return parseSessionToken(req.cookies[COOKIE_NAME]);
}

export function setSessionCookie(res: NextApiResponse, user: SessionUser) {
  const token = createSessionToken(user);
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`,
  );
}

export function clearSessionCookie(res: NextApiResponse) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

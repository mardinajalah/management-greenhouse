import type { NextApiRequest } from "next";

export function getBodyValue(value: unknown) {
  if (Array.isArray(value)) return value[0] ?? "";
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value;
  return "";
}

export function formBody(req: NextApiRequest) {
  return Object.fromEntries(Object.entries(req.body ?? {}).map(([key, value]) => [key, getBodyValue(value)]));
}

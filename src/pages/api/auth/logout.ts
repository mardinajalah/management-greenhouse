import type { NextApiRequest, NextApiResponse } from "next";
import { clearSessionCookie } from "@/lib/session";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  clearSessionCookie(res);
  res.redirect(303, "/login");
}

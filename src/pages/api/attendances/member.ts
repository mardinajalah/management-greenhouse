import type { NextApiRequest, NextApiResponse } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { getMemberCompletedAttendances } from "@/server/data";
import { requireApiSession } from "@/server/api";

type AttendanceRow = {
  id: number;
  attendanceDate: string;
  workTitle: string;
  workDescription: string | null;
  checkInTime: string;
  checkOutTime: string | null;
  photoUrl: string | null;
  userName: string;
};

function serializeRows(rows: Awaited<ReturnType<typeof getMemberCompletedAttendances>>) {
  return rows.map((row) => ({
    id: row.id,
    attendanceDate: row.attendanceDate,
    workTitle: row.workTitle,
    workDescription: row.workDescription,
    checkInTime: String(row.checkInTime),
    checkOutTime: row.checkOutTime ? String(row.checkOutTime) : null,
    photoUrl: row.photoUrl,
    userName: row.userName,
  }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = requireApiSession(req, res);
  if (!session) return;

  if (req.method !== "GET") {
    res.status(405).json({ message: "Method tidak didukung." });
    return;
  }

  const userId = Number(req.query.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    res.status(400).json({ message: "Parameter userId tidak valid." });
    return;
  }

  const target = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { id: true, name: true, role: true, isActive: true },
  });

  if (!target || target.role !== "user" || !target.isActive) {
    res.status(404).json({ message: "Anggota tidak ditemukan." });
    return;
  }

  if (session.role === "user" && session.id === userId) {
    res.status(403).json({ message: "Gunakan halaman presensi untuk melihat data Anda sendiri." });
    return;
  }

  const rows = await getMemberCompletedAttendances(userId);
  const attendances: AttendanceRow[] = serializeRows(rows);

  res.status(200).json({
    member: { id: target.id, name: target.name },
    attendances,
  });
}

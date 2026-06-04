import { and, count, desc, eq, like, or } from "drizzle-orm";
import { db } from "@/db/client";
import { getMonitoringRecordCount } from "@/lib/monitoring-data";
import { attendances, users } from "@/db/schema";

export async function hasAdmin() {
  const result = await db.select({ total: count() }).from(users).where(eq(users.role, "admin"));
  return Number(result[0]?.total ?? 0) > 0;
}

export async function getDashboardStats() {
  const [memberRows, attendanceRows, monitoringTotal] = await Promise.all([
    db.select({ total: count() }).from(users),
    db.select({ total: count() }).from(attendances),
    getMonitoringRecordCount(),
  ]);

  return {
    members: Number(memberRows[0]?.total ?? 0),
    attendances: Number(attendanceRows[0]?.total ?? 0),
    monitorings: monitoringTotal,
  };
}

export async function getLeaderboard() {
  return db
    .select({
      id: users.id,
      name: users.name,
      total: count(attendances.id),
    })
    .from(users)
    .leftJoin(attendances, and(eq(attendances.userId, users.id), eq(attendances.status, "selesai")))
    .where(and(eq(users.role, "user"), eq(users.isActive, true)))
    .groupBy(users.id, users.name)
    .orderBy(desc(count(attendances.id)))
    .limit(5);
}

export async function getMembers(params: { q?: string; role?: string; status?: string }) {
  const conditions = [];
  if (params.q) {
    conditions.push(or(like(users.name, `%${params.q}%`), like(users.email, `%${params.q}%`)));
  }
  if (params.role === "admin" || params.role === "user") {
    conditions.push(eq(users.role, params.role));
  }
  if (params.status === "active") {
    conditions.push(eq(users.isActive, true));
  }
  if (params.status === "inactive") {
    conditions.push(eq(users.isActive, false));
  }

  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      username: users.username,
      phone: users.phone,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(users.createdAt));
}

export async function getUserAttendances(userId: number) {
  return db
    .select()
    .from(attendances)
    .where(eq(attendances.userId, userId))
    .orderBy(desc(attendances.attendanceDate), desc(attendances.createdAt));
}

export async function getMemberCompletedAttendances(userId: number) {
  return db
    .select({
      id: attendances.id,
      attendanceDate: attendances.attendanceDate,
      workTitle: attendances.workTitle,
      workDescription: attendances.workDescription,
      checkInTime: attendances.checkInTime,
      checkOutTime: attendances.checkOutTime,
      photoUrl: attendances.photoUrl,
      userName: users.name,
    })
    .from(attendances)
    .innerJoin(users, eq(attendances.userId, users.id))
    .where(and(eq(attendances.userId, userId), eq(attendances.status, "selesai")))
    .orderBy(desc(attendances.attendanceDate), desc(attendances.createdAt));
}

export async function getAdminAttendances(params: { date?: string; q?: string; status?: string }) {
  const conditions = [];
  if (params.date) conditions.push(eq(attendances.attendanceDate, params.date));
  if (params.status) conditions.push(eq(attendances.status, params.status as typeof attendances.status.enumValues[number]));
  if (params.q) conditions.push(like(users.name, `%${params.q}%`));

  return db
    .select({
      id: attendances.id,
      attendanceDate: attendances.attendanceDate,
      workTitle: attendances.workTitle,
      workDescription: attendances.workDescription,
      checkInTime: attendances.checkInTime,
      checkOutTime: attendances.checkOutTime,
      status: attendances.status,
      photoUrl: attendances.photoUrl,
      userName: users.name,
    })
    .from(attendances)
    .innerJoin(users, eq(attendances.userId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(attendances.attendanceDate), desc(attendances.createdAt));
}

export async function getAttendanceTotals() {
  return db
    .select({
      userName: users.name,
      total: count(attendances.id),
    })
    .from(users)
    .leftJoin(attendances, eq(attendances.userId, users.id))
    .groupBy(users.id, users.name)
    .orderBy(desc(count(attendances.id)));
}

export async function getUserById(id: number) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

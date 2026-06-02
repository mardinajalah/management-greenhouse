import { and, count, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  attendances,
  comments,
  greenhouseMonitorings,
  monitoringPhotos,
  users,
} from "@/db/schema";

export async function hasAdmin() {
  const result = await db.select({ total: count() }).from(users).where(eq(users.role, "admin"));
  return Number(result[0]?.total ?? 0) > 0;
}

export async function getDashboardStats() {
  const [memberRows, attendanceRows, monitoringRows] = await Promise.all([
    db.select({ total: count() }).from(users),
    db.select({ total: count() }).from(attendances),
    db.select({ total: count() }).from(greenhouseMonitorings),
  ]);

  return {
    members: Number(memberRows[0]?.total ?? 0),
    attendances: Number(attendanceRows[0]?.total ?? 0),
    monitorings: Number(monitoringRows[0]?.total ?? 0),
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
      note: attendances.note,
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

export async function getMonitoringList() {
  return db
    .select({
      id: greenhouseMonitorings.id,
      monitoringDate: greenhouseMonitorings.monitoringDate,
      waterCondition: greenhouseMonitorings.waterCondition,
      waterPh: greenhouseMonitorings.waterPh,
      plantCondition: greenhouseMonitorings.plantCondition,
      pestCondition: greenhouseMonitorings.pestCondition,
      userName: users.name,
      photoUrl: sql<string>`MIN(${monitoringPhotos.photoUrl})`,
    })
    .from(greenhouseMonitorings)
    .innerJoin(users, eq(greenhouseMonitorings.userId, users.id))
    .leftJoin(monitoringPhotos, eq(monitoringPhotos.monitoringId, greenhouseMonitorings.id))
    .groupBy(
      greenhouseMonitorings.id,
      greenhouseMonitorings.monitoringDate,
      greenhouseMonitorings.waterCondition,
      greenhouseMonitorings.waterPh,
      greenhouseMonitorings.plantCondition,
      greenhouseMonitorings.pestCondition,
      users.name,
    )
    .orderBy(desc(greenhouseMonitorings.monitoringDate), desc(greenhouseMonitorings.createdAt));
}

export async function getMonitoringDetail(id: number) {
  const monitoring = await db.query.greenhouseMonitorings.findFirst({
    where: eq(greenhouseMonitorings.id, id),
    with: {
      user: true,
      photos: true,
      comments: {
        with: {
          admin: true,
        },
      },
    },
  });

  return monitoring ?? null;
}

export async function getUserById(id: number) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

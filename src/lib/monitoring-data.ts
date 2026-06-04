import { and, count, desc, eq, lte } from "drizzle-orm";
import { db } from "@/db/client";
import {
  monitoringComments,
  plantConditions,
  pleningSchedules,
  users,
  waterConditions,
} from "@/db/schema";
import type { MonitoringModule } from "@/lib/monitoring-modules";
import { todayDateString } from "@/lib/plening";

export async function syncDuePleningStatuses() {
  const today = todayDateString();
  await db
    .update(pleningSchedules)
    .set({ status: "siap", updatedAt: new Date() })
    .where(and(eq(pleningSchedules.status, "menunggu"), lte(pleningSchedules.pleningDate, today)));
}

export async function getMonitoringRecordCount() {
  const [plants, water, plening] = await Promise.all([
    db.select({ total: count() }).from(plantConditions),
    db.select({ total: count() }).from(waterConditions),
    db.select({ total: count() }).from(pleningSchedules),
  ]);

  return (
    Number(plants[0]?.total ?? 0) + Number(water[0]?.total ?? 0) + Number(plening[0]?.total ?? 0)
  );
}

export async function getPlantConditionList(userId?: number) {
  const conditions = userId ? eq(plantConditions.userId, userId) : undefined;

  return db
    .select({
      id: plantConditions.id,
      recordDate: plantConditions.recordDate,
      plantType: plantConditions.plantType,
      description: plantConditions.description,
      plantAge: plantConditions.plantAge,
      photoUrl: plantConditions.photoUrl,
      userName: users.name,
    })
    .from(plantConditions)
    .innerJoin(users, eq(plantConditions.userId, users.id))
    .where(conditions)
    .orderBy(desc(plantConditions.recordDate), desc(plantConditions.createdAt));
}

export async function getWaterConditionList(userId?: number) {
  const conditions = userId ? eq(waterConditions.userId, userId) : undefined;

  return db
    .select({
      id: waterConditions.id,
      recordDate: waterConditions.recordDate,
      roomNumber: waterConditions.roomNumber,
      initialPpm: waterConditions.initialPpm,
      nutrientMl: waterConditions.nutrientMl,
      finalPpm: waterConditions.finalPpm,
      initialPh: waterConditions.initialPh,
      phDownMl: waterConditions.phDownMl,
      finalPh: waterConditions.finalPh,
      waterTemperature: waterConditions.waterTemperature,
      userName: users.name,
    })
    .from(waterConditions)
    .innerJoin(users, eq(waterConditions.userId, users.id))
    .where(conditions)
    .orderBy(desc(waterConditions.recordDate), desc(waterConditions.createdAt));
}

export async function getPleningScheduleList(userId?: number) {
  await syncDuePleningStatuses();

  const conditions = userId ? eq(pleningSchedules.userId, userId) : undefined;

  return db
    .select({
      id: pleningSchedules.id,
      pleningDate: pleningSchedules.pleningDate,
      roomNumber: pleningSchedules.roomNumber,
      pleningType: pleningSchedules.pleningType,
      status: pleningSchedules.status,
      userName: users.name,
    })
    .from(pleningSchedules)
    .innerJoin(users, eq(pleningSchedules.userId, users.id))
    .where(conditions)
    .orderBy(desc(pleningSchedules.pleningDate), desc(pleningSchedules.createdAt));
}

export async function getDuePleningNotifications(userId?: number) {
  await syncDuePleningStatuses();
  const today = todayDateString();
  const rows = await getPleningScheduleList(userId);

  return rows.filter((row) => row.status === "siap" && row.pleningDate <= today);
}

export async function getPlantConditionDetail(id: number) {
  const [row] = await db
    .select({
      id: plantConditions.id,
      userId: plantConditions.userId,
      recordDate: plantConditions.recordDate,
      plantType: plantConditions.plantType,
      description: plantConditions.description,
      plantAge: plantConditions.plantAge,
      photoUrl: plantConditions.photoUrl,
      userName: users.name,
    })
    .from(plantConditions)
    .innerJoin(users, eq(plantConditions.userId, users.id))
    .where(eq(plantConditions.id, id))
    .limit(1);

  return row ?? null;
}

export async function getWaterConditionDetail(id: number) {
  const [row] = await db
    .select({
      id: waterConditions.id,
      userId: waterConditions.userId,
      recordDate: waterConditions.recordDate,
      roomNumber: waterConditions.roomNumber,
      initialPpm: waterConditions.initialPpm,
      nutrientMl: waterConditions.nutrientMl,
      finalPpm: waterConditions.finalPpm,
      initialPh: waterConditions.initialPh,
      phDownMl: waterConditions.phDownMl,
      finalPh: waterConditions.finalPh,
      waterTemperature: waterConditions.waterTemperature,
      userName: users.name,
    })
    .from(waterConditions)
    .innerJoin(users, eq(waterConditions.userId, users.id))
    .where(eq(waterConditions.id, id))
    .limit(1);

  return row ?? null;
}

export async function getPleningScheduleDetail(id: number) {
  await syncDuePleningStatuses();

  const [row] = await db
    .select({
      id: pleningSchedules.id,
      userId: pleningSchedules.userId,
      pleningDate: pleningSchedules.pleningDate,
      roomNumber: pleningSchedules.roomNumber,
      pleningType: pleningSchedules.pleningType,
      status: pleningSchedules.status,
      userName: users.name,
    })
    .from(pleningSchedules)
    .innerJoin(users, eq(pleningSchedules.userId, users.id))
    .where(eq(pleningSchedules.id, id))
    .limit(1);

  return row ?? null;
}

export async function getMonitoringComments(module: MonitoringModule, recordId: number) {
  return db
    .select({
      id: monitoringComments.id,
      comment: monitoringComments.comment,
      createdAt: monitoringComments.createdAt,
      adminName: users.name,
    })
    .from(monitoringComments)
    .innerJoin(users, eq(monitoringComments.adminId, users.id))
    .where(and(eq(monitoringComments.module, module), eq(monitoringComments.recordId, recordId)))
    .orderBy(desc(monitoringComments.createdAt));
}

export function canViewMonitoringRecord(
  record: { userId: number },
  viewer: { id: number; role: string },
) {
  return viewer.role === "admin" || record.userId === viewer.id;
}

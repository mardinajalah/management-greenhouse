import type { GetServerSidePropsContext } from "next";
import { getMonitoringComments } from "@/lib/monitoring-data";
import type { MonitoringModule } from "@/lib/monitoring-modules";
import { monitoringListPath } from "@/lib/monitoring-modules";
import { serialize } from "@/lib/serialize";
import { requireSession } from "@/server/auth";

export function parseMonitoringId(context: GetServerSidePropsContext) {
  const id = Number(context.params?.id);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export function getMonitoringMessage(context: GetServerSidePropsContext) {
  return typeof context.query.message === "string" ? context.query.message : "";
}

export async function loadMonitoringComments(module: MonitoringModule, recordId: number) {
  const rows = await getMonitoringComments(module, recordId);
  return serialize(
    rows.map((row) => ({
      id: row.id,
      comment: row.comment,
      adminName: row.adminName,
      createdAt: row.createdAt.toISOString(),
    })),
  );
}

export function monitoringBackHref(module: MonitoringModule, role: "admin" | "user") {
  return monitoringListPath(module, role);
}

export function requireMonitoringSession(context: GetServerSidePropsContext) {
  return requireSession(context);
}

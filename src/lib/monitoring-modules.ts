export type MonitoringModule = "plant" | "water" | "plening";

export const monitoringModuleSegments: Record<MonitoringModule, string> = {
  plant: "plants",
  water: "water",
  plening: "plening",
};

export function monitoringDetailPath(module: MonitoringModule, id: number) {
  return `/monitorings/${monitoringModuleSegments[module]}/${id}`;
}

export function monitoringListPath(module: MonitoringModule, role: "admin" | "user") {
  const base = role === "admin" ? "/admin/monitorings" : "/user/monitorings";
  return `${base}/${monitoringModuleSegments[module]}`;
}

export const pleningTypeLabels: Record<string, string> = {
  sprei_hama: "Sprei hama",
  sprei_penyakit: "Sprei penyakit",
  polinasi: "Polinasi",
  wiwil: "Wiwil",
  panen: "Panen",
};

export const pleningStatusLabels: Record<string, string> = {
  menunggu: "Menunggu jadwal",
  siap: "Siap dikerjakan",
  selesai: "Selesai",
};

export function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function isPleningNotificationDue(pleningDate: string, today = todayDateString()) {
  return pleningDate <= today;
}

export function canCompletePlening(
  pleningDate: string,
  status: string,
  today = todayDateString(),
) {
  return status !== "selesai" && isPleningNotificationDue(pleningDate, today);
}

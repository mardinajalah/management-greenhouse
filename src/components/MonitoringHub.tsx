import Link from "next/link";

type DuePlening = {
  id: number;
  pleningDate: string;
  roomNumber: number;
  pleningType: string;
  userName?: string;
};

type MonitoringHubProps = {
  basePath: "/user/monitorings" | "/admin/monitorings";
  duePlenings: DuePlening[];
  showUserOnNotifications?: boolean;
};

const modules = [
  {
    title: "Kondisi Tanaman",
    description: "Catat jenis tanaman, foto, deskripsi, dan usia tanaman.",
    href: "/plants",
    icon: "🌱",
  },
  {
    title: "Kondisi Air",
    description: "PPM, pH, nutrisi, dan suhu air per ruangan.",
    href: "/water",
    icon: "💧",
  },
  {
    title: "Jadwal Plening",
    description: "Jadwalkan dan selesaikan kegiatan plening greenhouse.",
    href: "/plening",
    icon: "📅",
  },
] as const;

export function MonitoringHub({ basePath, duePlenings, showUserOnNotifications }: MonitoringHubProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {duePlenings.length > 0 ? (
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-2">Notifikasi Plening</h2>
          <ul className="space-y-2">
            {duePlenings.map((item) => (
              <li key={item.id} className="text-sm text-amber-900">
                Ruangan {item.roomNumber} — {item.pleningDate}
                {showUserOnNotifications && item.userName ? ` (${item.userName})` : ""}
                {" · "}
                <Link href={`${basePath}/plening`} className="font-semibold underline">
                  Lihat jadwal
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={`${basePath}${mod.href}`}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <span className="text-3xl">{mod.icon}</span>
            <h2 className="text-lg font-bold text-slate-800 mt-4 group-hover:text-emerald-700">{mod.title}</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{mod.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

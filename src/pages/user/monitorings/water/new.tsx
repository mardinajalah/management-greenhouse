import type { GetServerSideProps } from "next";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import { MonitoringBackLink } from "@/components/MonitoringBackLink";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type Props = { user: SessionUser; today: string; message?: string };

export default function NewWaterConditionPage({ user, today, message }: Props) {
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none";
  const labelClass = "text-sm font-semibold text-slate-700 ml-1";

  return (
    <DashboardLayout title="Tambah Kondisi Air" user={user}>
      <div className="max-w-3xl mx-auto space-y-6">
        <MonitoringBackLink href="/user/monitorings/water" />
        <Message message={message} />

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Form Kondisi Air</h2>
          </div>

          <form action="/api/monitoring/water" method="post" className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={labelClass}>Tanggal</label>
                <input name="recordDate" type="date" defaultValue={today} required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Ruangan berapa</label>
                <input name="roomNumber" type="number" min={1} required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Kondisi awal PPM (150–3000)</label>
                <input name="initialPpm" type="number" min={150} max={3000} required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Tambah nutrisi air (ml)</label>
                <input name="nutrientMl" type="number" min={0} step="0.01" required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Hasil akhir PPM</label>
                <input name="finalPpm" type="number" min={150} max={3000} required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Kondisi awal pH (1–10)</label>
                <input name="initialPh" type="number" min={1} max={10} step="0.01" required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Tambahan PH Down (ml)</label>
                <input name="phDownMl" type="number" min={0} step="0.01" required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Hasil akhir pH</label>
                <input name="finalPh" type="number" min={1} max={10} step="0.01" required className={inputClass} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className={labelClass}>Suhu air (10–40 °C)</label>
                <input name="waterTemperature" type="number" min={10} max={40} step="0.01" required className={inputClass} />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl">
                Simpan
              </button>
              <Link href="/user/monitorings/water" className="px-6 py-3 text-sm font-bold text-slate-500">
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const guard = requireSession(context, { role: "user" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  return {
    props: {
      user: guard.user,
      today: new Date().toISOString().slice(0, 10),
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};

import type { GetServerSideProps } from "next";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import { MonitoringBackLink } from "@/components/MonitoringBackLink";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type Props = { user: SessionUser; today: string; message?: string };

const pleningOptions = [
  { value: "sprei_hama", label: "Sprei hama" },
  { value: "sprei_penyakit", label: "Sprei penyakit" },
  { value: "polinasi", label: "Polinasi" },
  { value: "wiwil", label: "Wiwil" },
  { value: "panen", label: "Panen" },
];

export default function NewPleningPage({ user, today, message }: Props) {
  return (
    <DashboardLayout title="Tambah Jadwal Plening" user={user}>
      <div className="max-w-3xl mx-auto space-y-6">
        <MonitoringBackLink href="/user/monitorings/plening" />
        <Message message={message} />

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Form Jadwal Plening</h2>
            <p className="text-sm text-slate-500 mt-1">
              Notifikasi dan tombol selesai aktif pada atau setelah tanggal plening.
            </p>
          </div>

          <form action="/api/monitoring/plening" method="post" className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Tanggal plening</label>
                <input
                  name="pleningDate"
                  type="date"
                  defaultValue={today}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Ruangan berapa</label>
                <input
                  name="roomNumber"
                  type="number"
                  min={1}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Jenis plening</label>
                <select
                  name="pleningType"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  {pleningOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl">
                Simpan Jadwal
              </button>
              <Link href="/user/monitorings/plening" className="px-6 py-3 text-sm font-bold text-slate-500">
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

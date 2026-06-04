import type { GetServerSideProps } from "next";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import { MonitoringBackLink } from "@/components/MonitoringBackLink";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type Props = { user: SessionUser; today: string; message?: string };

export default function NewPlantConditionPage({ user, today, message }: Props) {
  return (
    <DashboardLayout title="Tambah Kondisi Tanaman" user={user}>
      <div className="max-w-3xl mx-auto space-y-6">
        <MonitoringBackLink href="/user/monitorings/plants" />
        <Message message={message} />

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Form Kondisi Tanaman</h2>
          </div>

          <form action="/api/monitoring/plants" method="post" className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Tanggal</label>
                <input
                  name="recordDate"
                  type="date"
                  defaultValue={today}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Jenis tanaman</label>
                <input
                  name="plantType"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Usia tanaman</label>
                <input
                  name="plantAge"
                  required
                  placeholder="Contoh: 3 minggu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Deskripsi (wajib)</label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <PhotoUploadField label="Foto" required />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl">
                Simpan
              </button>
              <Link href="/user/monitorings/plants" className="px-6 py-3 text-sm font-bold text-slate-500">
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

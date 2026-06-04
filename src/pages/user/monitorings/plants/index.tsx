import Link from "next/link";
import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ImageLightbox } from "@/components/ImageLightbox";
import { Message } from "@/components/Message";
import { MonitoringBackLink } from "@/components/MonitoringBackLink";
import { formatAttendanceDate } from "@/lib/format";
import { getPlantConditionList } from "@/lib/monitoring-data";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type Props = {
  user: SessionUser;
  records: Awaited<ReturnType<typeof getPlantConditionList>>;
  message?: string;
};

export default function UserPlantConditionsPage({ user, records, message }: Props) {
  return (
    <DashboardLayout title="Kondisi Tanaman" user={user}>
      <div className="max-w-6xl mx-auto space-y-6">
        <MonitoringBackLink href="/user/monitorings" />
        <Message message={message} />

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Kondisi Tanaman</h2>
              <p className="text-sm text-slate-500">Riwayat pencatatan kondisi tanaman.</p>
            </div>
            <Link
              href="/user/monitorings/plants/new"
              className="inline-flex justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              + Tambah Kondisi Tanaman
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Jenis</th>
                  <th className="px-6 py-4">Usia</th>
                  <th className="px-6 py-4">Deskripsi</th>
                  <th className="px-6 py-4">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {formatAttendanceDate(item.recordDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{item.plantType}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.plantAge}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs line-clamp-2">{item.description}</td>
                    <td className="px-6 py-4">
                      <ImageLightbox src={item.photoUrl} alt={`Foto ${item.plantType}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {records.length === 0 ? (
            <p className="p-12 text-center text-sm text-slate-400">Belum ada data kondisi tanaman.</p>
          ) : null}
        </section>
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
      records: serialize(await getPlantConditionList(guard.user.id)),
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};

import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ImageLightbox } from "@/components/ImageLightbox";
import { MonitoringBackLink } from "@/components/MonitoringBackLink";
import { formatAttendanceDate } from "@/lib/format";
import { getPlantConditionList } from "@/lib/monitoring-data";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type Props = {
  user: SessionUser;
  records: Awaited<ReturnType<typeof getPlantConditionList>>;
};

export default function AdminPlantConditionsPage({ user, records }: Props) {
  return (
    <DashboardLayout title="Kondisi Tanaman" user={user}>
      <div className="max-w-6xl mx-auto space-y-6">
        <MonitoringBackLink href="/admin/monitorings" />

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Semua Kondisi Tanaman</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Anggota</th>
                  <th className="px-6 py-4">Jenis</th>
                  <th className="px-6 py-4">Usia</th>
                  <th className="px-6 py-4">Deskripsi</th>
                  <th className="px-6 py-4">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-semibold">{formatAttendanceDate(item.recordDate)}</td>
                    <td className="px-6 py-4 text-sm">{item.userName}</td>
                    <td className="px-6 py-4 text-sm">{item.plantType}</td>
                    <td className="px-6 py-4 text-sm">{item.plantAge}</td>
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
            <p className="p-12 text-center text-sm text-slate-400">Belum ada data.</p>
          ) : null}
        </section>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const guard = requireSession(context, { role: "admin" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  return { props: { user: guard.user, records: serialize(await getPlantConditionList()) } };
};

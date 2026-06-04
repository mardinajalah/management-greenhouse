import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MonitoringBackLink } from "@/components/MonitoringBackLink";
import { formatAttendanceDate } from "@/lib/format";
import { getPleningScheduleList } from "@/lib/monitoring-data";
import { isPleningNotificationDue, pleningStatusLabels, pleningTypeLabels, todayDateString } from "@/lib/plening";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type Props = {
  user: SessionUser;
  records: Awaited<ReturnType<typeof getPleningScheduleList>>;
  today: string;
};

export default function AdminPleningPage({ user, records, today }: Props) {
  return (
    <DashboardLayout title="Jadwal Plening" user={user}>
      <div className="max-w-6xl mx-auto space-y-6">
        <MonitoringBackLink href="/admin/monitorings" />

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Semua Jadwal Plening</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Anggota</th>
                  <th className="px-6 py-4">Ruangan</th>
                  <th className="px-6 py-4">Jenis</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((item) => {
                  const notificationDue = isPleningNotificationDue(item.pleningDate, today);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-sm font-semibold">{formatAttendanceDate(item.pleningDate)}</td>
                      <td className="px-6 py-4 text-sm">{item.userName}</td>
                      <td className="px-6 py-4 text-sm">{item.roomNumber}</td>
                      <td className="px-6 py-4 text-sm">{pleningTypeLabels[item.pleningType] ?? item.pleningType}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === "selesai"
                              ? "bg-emerald-100 text-emerald-700"
                              : notificationDue
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {pleningStatusLabels[item.status] ?? item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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

  return {
    props: {
      user: guard.user,
      records: serialize(await getPleningScheduleList()),
      today: todayDateString(),
    },
  };
};

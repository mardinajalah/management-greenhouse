import Link from "next/link";
import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import { MonitoringBackLink } from "@/components/MonitoringBackLink";
import { formatAttendanceDate } from "@/lib/format";
import { getDuePleningNotifications, getPleningScheduleList } from "@/lib/monitoring-data";
import { monitoringDetailPath } from "@/lib/monitoring-modules";
import {
  canCompletePlening,
  isPleningNotificationDue,
  pleningStatusLabels,
  pleningTypeLabels,
  todayDateString,
} from "@/lib/plening";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type Props = {
  user: SessionUser;
  records: Awaited<ReturnType<typeof getPleningScheduleList>>;
  duePlenings: Awaited<ReturnType<typeof getDuePleningNotifications>>;
  today: string;
  message?: string;
};

export default function UserPleningPage({ user, records, duePlenings, today, message }: Props) {
  return (
    <DashboardLayout title="Jadwal Plening" user={user}>
      <div className="max-w-6xl mx-auto space-y-6">
        <MonitoringBackLink href="/user/monitorings" />
        <Message message={message} />

        {duePlenings.length > 0 ? (
          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-amber-800 uppercase mb-2">Notifikasi hari ini</h2>
            <p className="text-sm text-amber-900">
              Ada {duePlenings.length} jadwal plening yang siap dikerjakan. Tombol Selesai aktif setelah tanggal plening
              tiba.
            </p>
          </section>
        ) : null}

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Jadwal Plening</h2>
              <p className="text-sm text-slate-500">Status dan penyelesaian kegiatan plening.</p>
            </div>
            <Link
              href="/user/monitorings/plening/new"
              className="inline-flex justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              + Tambah Jadwal Plening
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4">Tanggal plening</th>
                  <th className="px-6 py-4">Ruangan</th>
                  <th className="px-6 py-4">Jenis</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((item) => {
                  const canFinish = canCompletePlening(item.pleningDate, item.status, today);
                  const notificationDue = isPleningNotificationDue(item.pleningDate, today);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {formatAttendanceDate(item.pleningDate)}
                      </td>
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
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <Link
                            href={monitoringDetailPath("plening", item.id)}
                            className="inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          >
                            Detail
                          </Link>
                          {item.status === "selesai" ? null : canFinish ? (
                            <form action={`/api/monitoring/plening/${item.id}/finish`} method="post">
                              <button
                                type="submit"
                                className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-black"
                              >
                                Selesai
                              </button>
                            </form>
                          ) : (
                            <button
                              type="button"
                              disabled
                              title="Tombol aktif setelah tanggal plening tiba"
                              className="bg-slate-100 text-slate-400 text-xs px-3 py-1.5 rounded-lg font-semibold cursor-not-allowed"
                            >
                              Selesai
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {records.length === 0 ? (
            <p className="p-12 text-center text-sm text-slate-400">Belum ada jadwal plening.</p>
          ) : null}
        </section>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const guard = requireSession(context, { role: "user" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const userId = guard.user.id;

  return {
    props: {
      user: guard.user,
      records: serialize(await getPleningScheduleList(userId)),
      duePlenings: serialize(await getDuePleningNotifications(userId)),
      today: todayDateString(),
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};

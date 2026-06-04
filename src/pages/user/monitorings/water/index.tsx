import Link from "next/link";
import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import { MonitoringBackLink } from "@/components/MonitoringBackLink";
import { formatAttendanceDate } from "@/lib/format";
import { getWaterConditionList } from "@/lib/monitoring-data";
import { monitoringDetailPath } from "@/lib/monitoring-modules";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type Props = {
  user: SessionUser;
  records: Awaited<ReturnType<typeof getWaterConditionList>>;
  message?: string;
};

export default function UserWaterConditionsPage({ user, records, message }: Props) {
  return (
    <DashboardLayout title="Kondisi Air" user={user}>
      <div className="max-w-7xl mx-auto space-y-6">
        <MonitoringBackLink href="/user/monitorings" />
        <Message message={message} />

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Kondisi Air</h2>
              <p className="text-sm text-slate-500">Parameter PPM, pH, nutrisi, dan suhu air.</p>
            </div>
            <Link
              href="/user/monitorings/water/new"
              className="inline-flex justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              + Tambah Kondisi Air
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Ruangan</th>
                  <th className="px-4 py-3">PPM awal</th>
                  <th className="px-4 py-3">Nutrisi (ml)</th>
                  <th className="px-4 py-3">PPM akhir</th>
                  <th className="px-4 py-3">pH awal</th>
                  <th className="px-4 py-3">PH Down (ml)</th>
                  <th className="px-4 py-3">pH akhir</th>
                  <th className="px-4 py-3">Suhu (°C)</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-700">{formatAttendanceDate(item.recordDate)}</td>
                    <td className="px-4 py-3">{item.roomNumber}</td>
                    <td className="px-4 py-3">{item.initialPpm}</td>
                    <td className="px-4 py-3">{item.nutrientMl}</td>
                    <td className="px-4 py-3">{item.finalPpm}</td>
                    <td className="px-4 py-3">{item.initialPh}</td>
                    <td className="px-4 py-3">{item.phDownMl}</td>
                    <td className="px-4 py-3">{item.finalPh}</td>
                    <td className="px-4 py-3">{item.waterTemperature}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={monitoringDetailPath("water", item.id)}
                        className="inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {records.length === 0 ? (
            <p className="p-12 text-center text-sm text-slate-400">Belum ada data kondisi air.</p>
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
      records: serialize(await getWaterConditionList(guard.user.id)),
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};

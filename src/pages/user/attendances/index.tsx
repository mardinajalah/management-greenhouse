import Link from "next/link";
import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ImageLightbox } from "@/components/ImageLightbox";
import { Message } from "@/components/Message";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";
import { getUserAttendances } from "@/server/data";

type AttendancesPageProps = {
  user: SessionUser;
  attendances: Awaited<ReturnType<typeof getUserAttendances>>;
  message?: string;
};

export default function UserAttendancesPage({ user, attendances, message }: AttendancesPageProps) {
  return (
    <DashboardLayout title="Riwayat Presensi" user={user}>
      <div className="max-w-6xl mx-auto space-y-6">
        <Message message={message} />

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Presensi Saya</h2>
              <p className="text-sm text-slate-500">
                Daftar aktivitas pekerjaan Anda. Untuk menyelesaikan pekerjaan aktif, gunakan Dashboard.
              </p>
            </div>
            <Link
              href="/user/attendances/new"
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-100"
            >
              + Tambah Presensi
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4">Tanggal & Waktu</th>
                  <th className="px-6 py-4">Pekerjaan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendances.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700">{item.attendanceDate}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {item.checkInTime} — {item.checkOutTime || "..."}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-emerald-700">{item.workTitle}</div>
                      <div className="text-xs text-slate-500 line-clamp-2">{item.workDescription || "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "selesai" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.photoUrl ? (
                        <ImageLightbox src={item.photoUrl} alt={`Foto presensi ${item.workTitle}`} />
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {attendances.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-sm font-medium">Belum ada data presensi tersimpan.</p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<AttendancesPageProps> = async (context) => {
  const guard = requireSession(context, { role: "user" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  return {
    props: {
      user: guard.user,
      attendances: serialize(await getUserAttendances(guard.user.id)),
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};

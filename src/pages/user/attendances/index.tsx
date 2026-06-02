import Link from "next/link";
import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
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
      <Message message={message} />
      <section className="panel">
        <div className="panelHeader">
          <h2>Presensi Saya</h2>
          <Link className="button" href="/user/attendances/new">
            Tambah Presensi
          </Link>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Pekerjaan</th>
                <th>Jam</th>
                <th>Status</th>
                <th>Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((item) => (
                <tr key={item.id}>
                  <td>{item.attendanceDate}</td>
                  <td>
                    <strong>{item.workTitle}</strong>
                    <small style={{ display: "block" }}>{item.workDescription || "-"}</small>
                  </td>
                  <td>
                    {item.checkInTime} - {item.checkOutTime || "berjalan"}
                  </td>
                  <td>
                    <span className={item.status === "selesai" ? "badge" : "badge warn"}>{item.status}</span>
                  </td>
                  <td>{item.note || "-"}</td>
                  <td>
                    {item.status === "sedang_dikerjakan" ? (
                      <form className="actions" action={`/api/attendances/${item.id}/finish`} method="post">
                        <input name="checkOutTime" type="time" required />
                        <button type="submit">Selesai</button>
                      </form>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={6}>Belum ada data presensi.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
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

import Link from "next/link";
import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Leaderboard } from "@/components/Leaderboard";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";
import { getLeaderboard, getUserAttendances } from "@/server/data";

type UserDashboardProps = {
  user: SessionUser;
  activeAttendances: Awaited<ReturnType<typeof getUserAttendances>>;
  leaderboard: Awaited<ReturnType<typeof getLeaderboard>>;
};

export default function UserDashboard({ user, activeAttendances, leaderboard }: UserDashboardProps) {
  return (
    <DashboardLayout title="Dashboard User" user={user}>
      <section className="grid two">
        <div className="panel">
          <div className="panelHeader">
            <h2>Presensi Aktif</h2>
            <Link className="button" href="/user/attendances/new">
              Tambah Presensi
            </Link>
          </div>
          {activeAttendances.length === 0 ? (
            <p className="emptyText">Tidak ada pekerjaan yang sedang berjalan.</p>
          ) : (
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Pekerjaan</th>
                    <th>Mulai</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {activeAttendances.map((item) => (
                    <tr key={item.id}>
                      <td>{item.workTitle}</td>
                      <td>{item.checkInTime}</td>
                      <td>
                        <form action={`/api/attendances/${item.id}/finish`} method="post" className="actions">
                          <input name="checkOutTime" type="time" required />
                          <button type="submit">Selesai</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Leaderboard items={leaderboard.map((item) => ({ ...item, total: Number(item.total) }))} />
      </section>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<UserDashboardProps> = async (context) => {
  const guard = requireSession(context, { role: "user" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const [attendances, leaderboard] = await Promise.all([
    getUserAttendances(guard.user.id),
    getLeaderboard(),
  ]);

  return {
    props: {
      user: guard.user,
      activeAttendances: serialize(attendances.filter((item) => item.status === "sedang_dikerjakan")),
      leaderboard: leaderboard.map((item) => ({ ...item, total: Number(item.total) })),
    },
  };
};

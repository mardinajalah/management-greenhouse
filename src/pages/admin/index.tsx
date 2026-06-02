import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Leaderboard } from "@/components/Leaderboard";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";
import { getDashboardStats, getLeaderboard } from "@/server/data";

type AdminDashboardProps = {
  user: SessionUser;
  stats: {
    members: number;
    attendances: number;
    monitorings: number;
  };
  leaderboard: Awaited<ReturnType<typeof getLeaderboard>>;
};

export default function AdminDashboard({ user, stats, leaderboard }: AdminDashboardProps) {
  return (
    <DashboardLayout title="Dashboard Admin" user={user}>
      <section className="grid three">
        <div className="statCard">
          <span>Total Anggota</span>
          <strong>{stats.members}</strong>
        </div>
        <div className="statCard">
          <span>Total Presensi</span>
          <strong>{stats.attendances}</strong>
        </div>
        <div className="statCard">
          <span>Total Monitoring</span>
          <strong>{stats.monitorings}</strong>
        </div>
      </section>
      <Leaderboard items={leaderboard.map((item) => ({ ...item, total: Number(item.total) }))} />
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<AdminDashboardProps> = async (context) => {
  const guard = requireSession(context, { role: "admin" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const [stats, leaderboard] = await Promise.all([getDashboardStats(), getLeaderboard()]);

  return {
    props: {
      user: guard.user,
      stats,
      leaderboard: serialize(leaderboard.map((item) => ({ ...item, total: Number(item.total) }))),
    },
  };
};

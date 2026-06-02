import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";
import { getAdminAttendances, getAttendanceTotals } from "@/server/data";

type AdminAttendancesProps = {
  user: SessionUser;
  attendances: Awaited<ReturnType<typeof getAdminAttendances>>;
  totals: Awaited<ReturnType<typeof getAttendanceTotals>>;
  query: {
    date: string;
    q: string;
    status: string;
  };
};

export default function AdminAttendancesPage({ user, attendances, totals, query }: AdminAttendancesProps) {
  return (
    <DashboardLayout title="Absensi Anggota" user={user}>
      <section className="panel">
        <div className="panelHeader">
          <h2>Filter Absensi</h2>
        </div>
        <form className="filters" method="get">
          <div className="formRow">
            <label>Tanggal</label>
            <input type="date" name="date" defaultValue={query.date} />
          </div>
          <div className="formRow">
            <label>Nama Anggota</label>
            <input name="q" defaultValue={query.q} />
          </div>
          <div className="formRow">
            <label>Status</label>
            <select name="status" defaultValue={query.status}>
              <option value="">Semua</option>
              <option value="sedang_dikerjakan">Sedang dikerjakan</option>
              <option value="selesai">Selesai</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="alpha">Alpha</option>
            </select>
          </div>
          <button type="submit">Filter</button>
        </form>
      </section>
      <section className="grid two">
        <div className="panel">
          <div className="panelHeader">
            <h2>Daftar Absensi</h2>
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Anggota</th>
                  <th>Tanggal</th>
                  <th>Pekerjaan</th>
                  <th>Jam</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((item) => (
                  <tr key={item.id}>
                    <td>{item.userName}</td>
                    <td>{item.attendanceDate}</td>
                    <td>{item.workTitle}</td>
                    <td>
                      {item.checkInTime} - {item.checkOutTime || "berjalan"}
                    </td>
                    <td>
                      <span className={item.status === "selesai" ? "badge" : "badge warn"}>{item.status}</span>
                    </td>
                  </tr>
                ))}
                {attendances.length === 0 ? (
                  <tr>
                    <td colSpan={5}>Belum ada data absensi.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel">
          <div className="panelHeader">
            <h2>Total Per Anggota</h2>
          </div>
          <div className="leaderboard">
            {totals.map((item) => (
              <div className="leaderboardRow" key={item.userName}>
                <strong>{Number(item.total)}</strong>
                <span>{item.userName}</span>
                <b>presensi</b>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<AdminAttendancesProps> = async (context) => {
  const guard = requireSession(context, { role: "admin" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const query = {
    date: typeof context.query.date === "string" ? context.query.date : "",
    q: typeof context.query.q === "string" ? context.query.q : "",
    status: typeof context.query.status === "string" ? context.query.status : "",
  };

  const [attendances, totals] = await Promise.all([getAdminAttendances(query), getAttendanceTotals()]);

  return {
    props: {
      user: guard.user,
      attendances: serialize(attendances),
      totals: serialize(totals.map((item) => ({ ...item, total: Number(item.total) }))),
      query,
    },
  };
};

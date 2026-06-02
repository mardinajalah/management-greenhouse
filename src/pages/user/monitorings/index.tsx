import Image from "next/image";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";
import { getMonitoringList } from "@/server/data";

type UserMonitoringsProps = {
  user: SessionUser;
  monitorings: Awaited<ReturnType<typeof getMonitoringList>>;
  message?: string;
};

export default function UserMonitoringsPage({ user, monitorings, message }: UserMonitoringsProps) {
  return (
    <DashboardLayout title="Monitoring Greenhouse" user={user}>
      <Message message={message} />
      <section className="panel">
        <div className="panelHeader">
          <h2>Data Monitoring</h2>
          <Link className="button" href="/user/monitorings/new">
            Tambah Monitoring
          </Link>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Tanggal</th>
                <th>Penginput</th>
                <th>Air</th>
                <th>Tanaman</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {monitorings.map((item) => (
                <tr key={item.id}>
                  <td style={{ width: 140 }}>
                    {item.photoUrl ? (
                      <Image className="thumb" src={item.photoUrl} alt={item.waterCondition} width={160} height={120} />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{item.monitoringDate}</td>
                  <td>{item.userName}</td>
                  <td>
                    {item.waterCondition}
                    <small style={{ display: "block" }}>pH {item.waterPh}</small>
                  </td>
                  <td>{item.plantCondition}</td>
                  <td>
                    <Link className="button secondary" href={`/monitorings/${item.id}`}>
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
              {monitorings.length === 0 ? (
                <tr>
                  <td colSpan={6}>Belum ada data monitoring.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<UserMonitoringsProps> = async (context) => {
  const guard = requireSession(context, { role: "user" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  return {
    props: {
      user: guard.user,
      monitorings: serialize(await getMonitoringList()),
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};

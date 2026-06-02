import Image from "next/image";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";
import { getMonitoringDetail } from "@/server/data";

type MonitoringDetailProps = {
  user: SessionUser;
  monitoring: NonNullable<Awaited<ReturnType<typeof getMonitoringDetail>>>;
  message?: string;
};

export default function MonitoringDetailPage({ user, monitoring, message }: MonitoringDetailProps) {
  return (
    <DashboardLayout title="Detail Monitoring" user={user}>
      <Message message={message} />
      <section className="panel">
        <div className="panelHeader">
          <h2>{monitoring.monitoringDate}</h2>
          <Link className="button secondary" href={user.role === "admin" ? "/admin/monitorings" : "/user/monitorings"}>
            Kembali
          </Link>
        </div>
        <div className="grid two">
          <div className="grid">
            <p><strong>Penginput:</strong> {monitoring.user.name}</p>
            <p><strong>Kondisi Air:</strong> {monitoring.waterCondition}</p>
            <p><strong>pH Air:</strong> {monitoring.waterPh}</p>
            <p><strong>Suhu Air:</strong> {monitoring.waterTemperature}</p>
            <p><strong>Suhu Udara:</strong> {monitoring.airTemperature}</p>
            <p><strong>Kelembaban:</strong> {monitoring.humidity}</p>
            <p><strong>Kondisi Tanaman:</strong> {monitoring.plantCondition}</p>
            <p><strong>Hama/Penyakit:</strong> {monitoring.pestCondition}</p>
            <p><strong>Catatan:</strong> {monitoring.notes || "-"}</p>
          </div>
          <div className="photoGrid">
            {monitoring.photos.map((photo) => (
              <figure key={photo.id}>
                <Image src={photo.photoUrl} alt={photo.caption || "Foto monitoring"} width={420} height={320} />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="panel">
        <div className="panelHeader">
          <h2>Komentar Admin</h2>
        </div>
        <div className="grid">
          {monitoring.comments.map((item) => (
            <div className="panel" key={item.id}>
              <strong>{item.admin.name}</strong>
              <small style={{ color: "var(--muted)", display: "block", margin: "4px 0 8px" }}>
                {new Date(item.createdAt).toLocaleString("id-ID")}
              </small>
              <p>{item.comment}</p>
            </div>
          ))}
          {monitoring.comments.length === 0 ? <p className="emptyText">Belum ada komentar admin.</p> : null}
        </div>
        {user.role === "admin" ? (
          <form className="formGrid" action="/api/comments" method="post" style={{ marginTop: 16 }}>
            <input type="hidden" name="monitoringId" value={monitoring.id} />
            <div className="formRow">
              <label>Tambah Komentar</label>
              <textarea name="comment" required />
            </div>
            <button type="submit">Kirim Komentar</button>
          </form>
        ) : null}
      </section>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<MonitoringDetailProps> = async (context) => {
  const guard = requireSession(context);
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const id = Number(context.params?.id);
  const monitoring = Number.isInteger(id) ? await getMonitoringDetail(id) : null;

  if (!monitoring) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: guard.user,
      monitoring: serialize(monitoring),
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};

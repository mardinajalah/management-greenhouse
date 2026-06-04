import type { GetServerSideProps } from "next";
import { MonitoringCommentSection } from "@/components/MonitoringCommentSection";
import { MonitoringDetailLayout } from "@/components/MonitoringDetailLayout";
import { formatAttendanceDate } from "@/lib/format";
import { canViewMonitoringRecord, getWaterConditionDetail } from "@/lib/monitoring-data";
import {
  getMonitoringMessage,
  loadMonitoringComments,
  monitoringBackHref,
  parseMonitoringId,
  requireMonitoringSession,
} from "@/lib/monitoring-detail-props";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";

type Props = {
  user: SessionUser;
  record: NonNullable<Awaited<ReturnType<typeof getWaterConditionDetail>>>;
  comments: Awaited<ReturnType<typeof loadMonitoringComments>>;
  backHref: string;
  message?: string;
};

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

export default function WaterConditionDetailPage({ user, record, comments, backHref, message }: Props) {
  return (
    <MonitoringDetailLayout
      user={user}
      title={`Kondisi Air — Ruangan ${record.roomNumber}`}
      subtitle={formatAttendanceDate(record.recordDate)}
      recordId={record.id}
      backHref={backHref}
      message={message}
    >
      <DetailField label="Dicatat oleh" value={record.userName} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <DetailField label="PPM awal" value={`${record.initialPpm} PPM`} />
        <DetailField label="Nutrisi ditambahkan" value={`${record.nutrientMl} ml`} />
        <DetailField label="PPM akhir" value={`${record.finalPpm} PPM`} />
        <DetailField label="pH awal" value={String(record.initialPh)} />
        <DetailField label="PH Down" value={`${record.phDownMl} ml`} />
        <DetailField label="pH akhir" value={String(record.finalPh)} />
        <DetailField label="Suhu air" value={`${record.waterTemperature} °C`} />
      </div>

      <MonitoringCommentSection user={user} module="water" recordId={record.id} comments={comments} />
    </MonitoringDetailLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const guard = requireMonitoringSession(context);
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const id = parseMonitoringId(context);
  if (!id) return { notFound: true };

  const record = await getWaterConditionDetail(id);
  if (!record || !canViewMonitoringRecord(record, guard.user)) return { notFound: true };

  return {
    props: {
      user: guard.user,
      record: serialize(record),
      comments: await loadMonitoringComments("water", id),
      backHref: monitoringBackHref("water", guard.user.role),
      message: getMonitoringMessage(context),
    },
  };
};

import type { GetServerSideProps } from "next";
import { ImageLightbox } from "@/components/ImageLightbox";
import { MonitoringCommentSection } from "@/components/MonitoringCommentSection";
import { MonitoringDetailLayout } from "@/components/MonitoringDetailLayout";
import { formatAttendanceDate } from "@/lib/format";
import { canViewMonitoringRecord, getPlantConditionDetail } from "@/lib/monitoring-data";
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
  record: NonNullable<Awaited<ReturnType<typeof getPlantConditionDetail>>>;
  comments: Awaited<ReturnType<typeof loadMonitoringComments>>;
  backHref: string;
  message?: string;
};

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-slate-700 mt-1">{value}</p>
    </div>
  );
}

export default function PlantConditionDetailPage({ user, record, comments, backHref, message }: Props) {
  return (
    <MonitoringDetailLayout
      user={user}
      title={record.plantType}
      subtitle={formatAttendanceDate(record.recordDate)}
      recordId={record.id}
      backHref={backHref}
      message={message}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DetailField label="Tanggal" value={formatAttendanceDate(record.recordDate)} />
        <DetailField label="Dicatat oleh" value={record.userName} />
        <DetailField label="Usia tanaman" value={record.plantAge} />
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Deskripsi</p>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{record.description}</p>
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Foto dokumentasi</p>
        <ImageLightbox
          src={record.photoUrl}
          alt={`Foto ${record.plantType}`}
          thumbnailClassName="h-48 w-full max-w-sm rounded-xl object-cover border border-slate-200 hover:ring-2 hover:ring-emerald-400 transition-all cursor-zoom-in"
        />
      </div>

      <MonitoringCommentSection user={user} module="plant" recordId={record.id} comments={comments} />
    </MonitoringDetailLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const guard = requireMonitoringSession(context);
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const id = parseMonitoringId(context);
  if (!id) return { notFound: true };

  const record = await getPlantConditionDetail(id);
  if (!record || !canViewMonitoringRecord(record, guard.user)) return { notFound: true };

  return {
    props: {
      user: guard.user,
      record: serialize(record),
      comments: await loadMonitoringComments("plant", id),
      backHref: monitoringBackHref("plant", guard.user.role),
      message: getMonitoringMessage(context),
    },
  };
};

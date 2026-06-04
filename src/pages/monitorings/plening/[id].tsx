import type { GetServerSideProps } from "next";
import { MonitoringCommentSection } from "@/components/MonitoringCommentSection";
import { MonitoringDetailLayout } from "@/components/MonitoringDetailLayout";
import { formatAttendanceDate } from "@/lib/format";
import { canViewMonitoringRecord, getPleningScheduleDetail } from "@/lib/monitoring-data";
import {
  getMonitoringMessage,
  loadMonitoringComments,
  monitoringBackHref,
  parseMonitoringId,
  requireMonitoringSession,
} from "@/lib/monitoring-detail-props";
import { canCompletePlening, pleningStatusLabels, pleningTypeLabels, todayDateString } from "@/lib/plening";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";

type Props = {
  user: SessionUser;
  record: NonNullable<Awaited<ReturnType<typeof getPleningScheduleDetail>>>;
  comments: Awaited<ReturnType<typeof loadMonitoringComments>>;
  backHref: string;
  canFinish: boolean;
  message?: string;
};

export default function PleningDetailPage({
  user,
  record,
  comments,
  backHref,
  canFinish,
  message,
}: Props) {
  const statusLabel = pleningStatusLabels[record.status] ?? record.status;
  const typeLabel = pleningTypeLabels[record.pleningType] ?? record.pleningType;

  return (
    <MonitoringDetailLayout
      user={user}
      title={`Plening — Ruangan ${record.roomNumber}`}
      subtitle={formatAttendanceDate(record.pleningDate)}
      recordId={record.id}
      backHref={backHref}
      message={message}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Jenis plening</p>
          <p className="text-sm font-semibold text-slate-800 mt-1">{typeLabel}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
          <p className="text-sm font-semibold text-emerald-700 mt-1">{statusLabel}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Dicatat oleh</p>
          <p className="text-sm font-semibold text-slate-800 mt-1">{record.userName}</p>
        </div>
      </div>

      {user.role === "user" && record.status !== "selesai" ? (
        <div className="flex flex-wrap items-center gap-3">
          {canFinish ? (
            <form action={`/api/monitoring/plening/${record.id}/finish`} method="post">
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl"
              >
                Tandai Selesai
              </button>
            </form>
          ) : (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
              Tombol selesai aktif setelah tanggal plening tiba.
            </p>
          )}
        </div>
      ) : null}

      <MonitoringCommentSection user={user} module="plening" recordId={record.id} comments={comments} />
    </MonitoringDetailLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const guard = requireMonitoringSession(context);
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const id = parseMonitoringId(context);
  if (!id) return { notFound: true };

  const record = await getPleningScheduleDetail(id);
  if (!record || !canViewMonitoringRecord(record, guard.user)) return { notFound: true };

  const today = todayDateString();
  const canFinish =
    guard.user.role === "user" &&
    guard.user.id === record.userId &&
    canCompletePlening(record.pleningDate, record.status, today);

  return {
    props: {
      user: guard.user,
      record: serialize(record),
      comments: await loadMonitoringComments("plening", id),
      backHref: monitoringBackHref("plening", guard.user.role),
      canFinish,
      message: getMonitoringMessage(context),
    },
  };
};

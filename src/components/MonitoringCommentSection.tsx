import type { MonitoringModule } from "@/lib/monitoring-modules";
import type { SessionUser } from "@/lib/session";
import { formatAttendanceDate } from "@/lib/format";

export type MonitoringCommentItem = {
  id: number;
  comment: string;
  createdAt: string;
  adminName: string;
};

type MonitoringCommentSectionProps = {
  user: SessionUser;
  module: MonitoringModule;
  recordId: number;
  comments: MonitoringCommentItem[];
};

export function MonitoringCommentSection({ user, module, recordId, comments }: MonitoringCommentSectionProps) {
  const isAdmin = user.role === "admin";

  return (
    <section className="border-t border-slate-100 pt-6">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Komentar Admin</h2>

      {comments.length === 0 ? (
        <p className="text-sm text-slate-400 italic mb-4">Belum ada komentar dari admin.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {comments.map((item) => (
            <li key={item.id} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                {item.adminName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-700">{item.adminName}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatAttendanceDate(item.createdAt.slice(0, 10))}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isAdmin ? (
        <form action="/api/monitoring/comments" method="post" className="space-y-3">
          <input type="hidden" name="module" value={module} />
          <input type="hidden" name="recordId" value={recordId} />
          <label className="text-sm font-semibold text-slate-700 ml-1">Tambah komentar</label>
          <textarea
            name="comment"
            rows={3}
            required
            placeholder="Tulis catatan atau arahan untuk anggota..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            Kirim Komentar
          </button>
        </form>
      ) : (
        <p className="text-xs text-slate-400">Hanya admin yang dapat menambahkan komentar.</p>
      )}
    </section>
  );
}

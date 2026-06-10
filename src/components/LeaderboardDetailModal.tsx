import { useEffect } from "react";
import { ClientPortal } from "@/components/ClientPortal";
import { ImageLightbox } from "@/components/ImageLightbox";
import { formatAttendanceDate, formatTimeLabel } from "@/lib/format";
import type { MemberAttendanceDetail } from "@/lib/member-attendances";

export type { MemberAttendanceDetail };

type LeaderboardDetailModalProps = {
  open: boolean;
  memberName: string;
  loading: boolean;
  error: string | null;
  attendances: MemberAttendanceDetail[];
  onClose: () => void;
};

export function LeaderboardDetailModal({
  open,
  memberName,
  loading,
  error,
  attendances,
  onClose,
}: LeaderboardDetailModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <ClientPortal>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          aria-label="Tutup detail presensi"
          onClick={onClose}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="leaderboard-detail-title"
          className="relative z-10 w-full max-w-3xl max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-linear-to-r from-emerald-50 to-white">
            <div>
              <h2 id="leaderboard-detail-title" className="text-lg font-bold text-slate-800">
                Detail Presensi — {memberName}
              </h2>
              <p className="text-sm text-slate-500 mt-1">Riwayat pekerjaan yang telah diselesaikan.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <p className="text-sm text-slate-500 text-center py-10">Memuat data presensi…</p>
            ) : error ? (
              <p className="text-sm text-rose-600 text-center py-10">{error}</p>
            ) : attendances.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">Belum ada presensi selesai.</p>
            ) : (
              <div className="space-y-4">
                {attendances.map((item) => (
                  <article
                    key={item.id}
                    className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{formatAttendanceDate(item.attendanceDate)}</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {formatTimeLabel(item.checkInTime)} — {formatTimeLabel(item.checkOutTime)}
                        </p>
                      </div>
                      {item.photoUrl ? (
                        <ImageLightbox
                          src={item.photoUrl}
                          alt={`Foto presensi ${item.workTitle}`}
                          thumbnailClassName="h-16 w-16 rounded-lg object-cover border border-slate-200 hover:ring-2 hover:ring-emerald-400 transition-all cursor-zoom-in shrink-0"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{item.workTitle}</p>
                      {item.workDescription ? (
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.workDescription}</p>
                      ) : (
                        <p className="text-sm text-slate-400 mt-1 italic">Tidak ada deskripsi tambahan.</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientPortal>
  );
}

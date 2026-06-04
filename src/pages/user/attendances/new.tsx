import { useState, type ChangeEvent } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type NewAttendancePageProps = {
  user: SessionUser;
  today: string;
  message?: string;
};

export default function NewAttendancePage({ user, today, message }: NewAttendancePageProps) {
  const [photo, setPhoto] = useState({ data: "", name: "", type: "" });

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPhoto({ data: "", name: "", type: "" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto({
        data: String(reader.result ?? ""),
        name: file.name,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <DashboardLayout title="Input Presensi Baru" user={user}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Message message={message} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 font-display">Detail Pekerjaan</h2>
            <p className="text-sm text-slate-500">Lengkapi formulir di bawah untuk mencatat aktivitas harian Anda.</p>
          </div>

          <form action="/api/attendances" method="post" className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Tanggal</label>
                <input
                  name="attendanceDate"
                  type="date"
                  defaultValue={today}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Status Kehadiran</label>
                <select
                  name="status"
                  defaultValue="sedang_dikerjakan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none bg-white"
                >
                  <option value="sedang_dikerjakan">⏳ Sedang dikerjakan</option>
                  <option value="selesai">✅ Selesai</option>
                  <option value="izin">📝 Izin</option>
                  <option value="sakit">🤒 Sakit</option>
                  <option value="alpha">❌ Alpha</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Nama Pekerjaan</label>
                <input
                  name="workTitle"
                  required
                  placeholder="Contoh: Pemupukan Area B"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Jam Masuk</label>
                <input
                  name="checkInTime"
                  type="time"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Jam Keluar (Opsional)</label>
                <input
                  name="checkOutTime"
                  type="time"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Deskripsi (opsional)</label>
                <textarea
                  name="workDescription"
                  rows={3}
                  placeholder="Jelaskan apa saja yang Anda lakukan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Foto dokumentasi (opsional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-semibold hover:file:bg-emerald-100"
                />
                <p className="text-xs text-slate-400 ml-1">JPG, PNG, atau WEBP. Maks. 2MB.</p>
                {photo.name ? (
                  <p className="text-xs font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded mt-2 inline-block">
                    ✓ Terpilih: {photo.name}
                  </p>
                ) : null}
                <input type="hidden" name="photoData" value={photo.data} />
                <input type="hidden" name="photoName" value={photo.name} />
                <input type="hidden" name="photoType" value={photo.type} />
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]"
              >
                Simpan Presensi
              </button>
              <Link
                href="/user/attendances"
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<NewAttendancePageProps> = async (context) => {
  const guard = requireSession(context, { role: "user" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  return {
    props: {
      user: guard.user,
      today: new Date().toISOString().slice(0, 10),
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};

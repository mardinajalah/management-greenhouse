import type { GetServerSideProps } from "next";
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
  return (
    <DashboardLayout title="Tambah Presensi" user={user}>
      <Message message={message} />
      <section className="panel">
        <form className="grid two" action="/api/attendances" method="post">
          <div className="formRow">
            <label>Tanggal</label>
            <input name="attendanceDate" type="date" defaultValue={today} required />
          </div>
          <div className="formRow">
            <label>Status</label>
            <select name="status" defaultValue="sedang_dikerjakan">
              <option value="sedang_dikerjakan">Sedang dikerjakan</option>
              <option value="selesai">Selesai</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="alpha">Alpha</option>
            </select>
          </div>
          <div className="formRow">
            <label>Nama Pekerjaan</label>
            <input name="workTitle" required placeholder="Menyiram tanaman" />
          </div>
          <div className="formRow">
            <label>Jam Masuk</label>
            <input name="checkInTime" type="time" required />
          </div>
          <div className="formRow">
            <label>Jam Keluar</label>
            <input name="checkOutTime" type="time" />
          </div>
          <div className="formRow">
            <label>Catatan</label>
            <input name="note" />
          </div>
          <div className="formRow" style={{ gridColumn: "1 / -1" }}>
            <label>Deskripsi Pekerjaan</label>
            <textarea name="workDescription" />
          </div>
          <button type="submit">Simpan Presensi</button>
        </form>
      </section>
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

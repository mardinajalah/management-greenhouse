import { useState, type ChangeEvent } from "react";
import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type NewMonitoringProps = {
  user: SessionUser;
  today: string;
  message?: string;
};

export default function NewMonitoringPage({ user, today, message }: NewMonitoringProps) {
  const [photo, setPhoto] = useState({ data: "", name: "", type: "" });

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

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
    <DashboardLayout title="Tambah Monitoring" user={user}>
      <Message message={message} />
      <section className="panel">
        <form className="grid two" action="/api/monitorings" method="post">
          <div className="formRow">
            <label>Tanggal Monitoring</label>
            <input name="monitoringDate" type="date" defaultValue={today} required />
          </div>
          <div className="formRow">
            <label>Kondisi Air</label>
            <input name="waterCondition" required />
          </div>
          <div className="formRow">
            <label>pH Air</label>
            <input name="waterPh" type="number" min="0" max="14" step="0.01" required />
          </div>
          <div className="formRow">
            <label>Suhu Air</label>
            <input name="waterTemperature" type="number" step="0.01" required />
          </div>
          <div className="formRow">
            <label>Suhu Udara</label>
            <input name="airTemperature" type="number" step="0.01" required />
          </div>
          <div className="formRow">
            <label>Kelembaban</label>
            <input name="humidity" type="number" min="0" max="100" step="0.01" required />
          </div>
          <div className="formRow">
            <label>Kondisi Tanaman</label>
            <input name="plantCondition" required />
          </div>
          <div className="formRow">
            <label>Kondisi Hama atau Penyakit</label>
            <input name="pestCondition" required />
          </div>
          <div className="formRow">
            <label>Foto Dokumentasi</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} required />
            <input type="hidden" name="photoData" value={photo.data} />
            <input type="hidden" name="photoName" value={photo.name} />
            <input type="hidden" name="photoType" value={photo.type} />
          </div>
          <div className="formRow">
            <label>Caption Foto</label>
            <input name="caption" />
          </div>
          <div className="formRow" style={{ gridColumn: "1 / -1" }}>
            <label>Catatan Tambahan</label>
            <textarea name="notes" />
          </div>
          <button type="submit">Simpan Monitoring</button>
        </form>
      </section>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<NewMonitoringProps> = async (context) => {
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

import { useState, type ChangeEvent } from "react";

type PhotoUploadFieldProps = {
  label?: string;
  required?: boolean;
};

export function PhotoUploadField({
  label = "Foto dokumentasi",
  required = false,
}: PhotoUploadFieldProps) {
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
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700 ml-1">
        {label}
        {required ? "" : " (opsional)"}
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handlePhotoChange}
        required={required && !photo.data}
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
  );
}

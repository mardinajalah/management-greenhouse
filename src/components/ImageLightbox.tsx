import { useEffect, useState } from "react";
import { ClientPortal } from "@/components/ClientPortal";

type ImageLightboxProps = {
  src: string;
  alt: string;
  thumbnailClassName?: string;
};

export function ImageLightbox({
  src,
  alt,
  thumbnailClassName = "h-12 w-12 rounded-lg object-cover border border-slate-200 hover:ring-2 hover:ring-emerald-400 transition-all cursor-zoom-in",
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-block" aria-label={`Perbesar ${alt}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={thumbnailClassName} />
      </button>

      {open ? (
        <ClientPortal>
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <button
              type="button"
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              aria-label="Tutup gambar"
              onClick={() => setOpen(false)}
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 text-lg"
              aria-label="Tutup"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="relative z-10 max-h-[90vh] max-w-full rounded-lg shadow-2xl object-contain"
            />
          </div>
        </ClientPortal>
      ) : null}
    </>
  );
}

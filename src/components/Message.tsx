import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

type MessageProps = {
  message?: string;
};

export function Message({ message }: MessageProps) {
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      
      // Delay micro untuk memicu CSS transition masuk (slide-in)
      const timerStart = setTimeout(() => setAnimate(true), 50);

      // Mulai transisi keluar (slide-out) setelah 3.7 detik
      const timerExit = setTimeout(() => setAnimate(false), 3700);

      // Sembunyikan sepenuhnya dari DOM setelah total 4 detik
      const timerEnd = setTimeout(() => setShow(false), 4000);

      return () => {
        clearTimeout(timerStart);
        clearTimeout(timerExit);
        clearTimeout(timerEnd);
      };
    }
  }, [message]);

  if (!show || !message) return null;

  return (
    <div
      className={`fixed top-24 right-4 z-50 flex w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-xl transition-all duration-300 ease-out sm:right-6 ${
        animate 
          ? "translate-x-0 opacity-100" 
          : "translate-x-full opacity-0"
      }`}
    >
      <div className="flex w-full items-start gap-3">
        {/* Icon Notifikasi */}
        <div className="flex shrink-0 items-center justify-center rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
          <CheckCircle size={20} strokeWidth={2.5} />
        </div>
        
        {/* Konten Teks */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">Berhasil</p>
          <p className="text-xs text-slate-500 mt-0.5">{message}</p>
        </div>
        
        {/* Tombol Close Manual */}
        <button
          onClick={() => setAnimate(false)}
          className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress Bar Timer (Indikator Delay) */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-amber-500"
        style={{
          width: animate ? "0%" : "100%",
          transition: animate ? "width 3700ms linear" : "none",
        }}
      />
    </div>
  );
}

import type { GetServerSideProps } from "next";
import { requireSession } from "@/server/auth";

export default function LegacyMonitoringRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const guard = requireSession(context);
  if (guard.redirect) return { redirect: guard.redirect };

  const base = guard.user?.role === "admin" ? "/admin/monitorings" : "/user/monitorings";

  return {
    redirect: {
      destination: `${base}?message=${encodeURIComponent("Pilih modul monitoring (tanaman, air, atau plening) dari halaman utama.")}`,
      permanent: false,
    },
  };
};

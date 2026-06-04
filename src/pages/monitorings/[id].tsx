import type { GetServerSideProps } from "next";
import { requireSession } from "@/server/auth";

export default function LegacyMonitoringRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const guard = requireSession(context);
  if (guard.redirect) return { redirect: guard.redirect };

  const destination =
    guard.user?.role === "admin" ? "/admin/monitorings" : "/user/monitorings";

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};

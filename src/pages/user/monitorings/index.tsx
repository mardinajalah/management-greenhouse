import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import { MonitoringHub } from "@/components/MonitoringHub";
import { getDuePleningNotifications } from "@/lib/monitoring-data";
import { pleningTypeLabels } from "@/lib/plening";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";

type UserMonitoringHubProps = {
  user: SessionUser;
  duePlenings: Awaited<ReturnType<typeof getDuePleningNotifications>>;
  message?: string;
};

export default function UserMonitoringHubPage({ user, duePlenings, message }: UserMonitoringHubProps) {
  return (
    <DashboardLayout title="Monitoring Greenhouse" user={user}>
      <Message message={message} />
      <MonitoringHub
        basePath="/user/monitorings"
        duePlenings={duePlenings.map((item) => ({
          ...item,
          pleningType: pleningTypeLabels[item.pleningType] ?? item.pleningType,
        }))}
      />
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<UserMonitoringHubProps> = async (context) => {
  const guard = requireSession(context, { role: "user" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  return {
    props: {
      user: guard.user,
      duePlenings: serialize(await getDuePleningNotifications(guard.user.id)),
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};

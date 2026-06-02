import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSessionFromRequest, type SessionUser } from "@/lib/session";

type GuardOptions = {
  role?: SessionUser["role"];
};

export function requireSession(context: GetServerSidePropsContext, options: GuardOptions = {}) {
  const user = getSessionFromRequest(context.req);

  if (!user) {
    return {
      user: null,
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (options.role && user.role !== options.role) {
    return {
      user: null,
      redirect: {
        destination: user.role === "admin" ? "/admin" : "/user",
        permanent: false,
      },
    };
  }

  return { user, redirect: null };
}

export function redirectIfAuthenticated(context: GetServerSidePropsContext): GetServerSidePropsResult<Record<string, never>> | null {
  const user = getSessionFromRequest(context.req);
  if (!user) return null;

  return {
    redirect: {
      destination: user.role === "admin" ? "/admin" : "/user",
      permanent: false,
    },
  };
}

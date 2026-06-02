import type { GetServerSideProps } from "next";
import { getSessionFromRequest } from "@/lib/session";

export default function Home() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSessionFromRequest(context.req);

  return {
    redirect: {
      destination: user ? (user.role === "admin" ? "/admin" : "/user") : "/login",
      permanent: false,
    },
  };
};

import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Message } from "@/components/Message";
import { redirectIfAuthenticated } from "@/server/auth";

type LoginPageProps = {
  message?: string;
};

export default function LoginPage({ message }: LoginPageProps) {
  return (
    <>
      <Head>
        <title>Login - Greenhouse</title>
      </Head>
      <main className="authPage">
        <section className="authCard">
          <h1>Masuk Dashboard</h1>
          <p>Kelola presensi pekerjaan dan monitoring kondisi greenhouse dari satu tempat.</p>
          <Message message={message} />
          <form className="formGrid" action="/api/auth/login" method="post">
            <div className="formRow">
              <label htmlFor="identifier">Email atau Username</label>
              <input id="identifier" name="identifier" autoComplete="username" required />
            </div>
            <div className="formRow">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <button type="submit">Masuk</button>
          </form>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<LoginPageProps> = async (context) => {
  const redirect = redirectIfAuthenticated(context);
  if (redirect) return redirect;

  return {
    props: {
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};

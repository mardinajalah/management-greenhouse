import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import type { SessionUser } from "@/lib/session";

type NavItem = {
  href: string;
  label: string;
};

const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/members", label: "Anggota" },
  { href: "/admin/attendances", label: "Absensi" },
  { href: "/admin/monitorings", label: "Monitoring" },
];

const userNav: NavItem[] = [
  { href: "/user", label: "Dashboard" },
  { href: "/user/attendances", label: "Presensi" },
  { href: "/user/monitorings", label: "Monitoring" },
];

type DashboardLayoutProps = {
  title: string;
  user: SessionUser;
  children: ReactNode;
};

export function DashboardLayout({ title, user, children }: DashboardLayoutProps) {
  const router = useRouter();
  const nav = user.role === "admin" ? adminNav : userNav;

  return (
    <>
      <Head>
        <title>{`${title} - Greenhouse`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="appShell">
        <aside className="sidebar">
          <div className="brand">
            <span className="brandMark">GH</span>
            <div>
              <strong>Greenhouse</strong>
              <small>Management</small>
            </div>
          </div>
          <nav className="navList">
            {nav.map((item) => (
              <Link
                key={item.href}
                className={router.pathname === item.href ? "navItem active" : "navItem"}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="mainPanel">
          <header className="topbar">
            <div>
              <p className="eyebrow">{user.role === "admin" ? "Admin Area" : "User Area"}</p>
              <h1>{title}</h1>
            </div>
            <div className="accountBox">
              <span>{user.name}</span>
              <form action="/api/auth/logout" method="post">
                <button className="secondary" type="submit">
                  Keluar
                </button>
              </form>
            </div>
          </header>
          {children}
        </main>
      </div>
    </>
  );
}

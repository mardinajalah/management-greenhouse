import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import type { SessionUser } from '@/lib/session';

type NavItem = {
  href: string;
  label: string;
};

const adminNav: NavItem[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/members', label: 'Anggota' },
  { href: '/admin/attendances', label: 'Absensi' },
  { href: '/admin/monitorings', label: 'Monitoring' },
];

const userNav: NavItem[] = [
  { href: '/user', label: 'Dashboard' },
  { href: '/user/attendances', label: 'Presensi' },
  { href: '/user/monitorings', label: 'Monitoring' },
];

type DashboardLayoutProps = {
  title: string;
  user: SessionUser;
  children: ReactNode;
};

export function DashboardLayout({ title, user, children }: DashboardLayoutProps) {
  const router = useRouter();
  const nav = user.role === 'admin' ? adminNav : userNav;

  return (
    <>
      <Head>
        <title>{`${title} - Greenhouse`}</title>
      </Head>
      <div className='flex min-h-screen bg-slate-50'>
        {/* Sidebar */}
        <aside className='w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full'>
          <div className='p-6 flex items-center gap-3'>
            <div className='w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-100'>GH</div>
            <div>
              <h1 className='font-bold text-slate-800 leading-none'>Greenhouse</h1>
              <span className='text-xs text-slate-500 font-medium tracking-wide uppercase'>System</span>
            </div>
          </div>

          <nav className='flex-1 px-4 py-4 space-y-1'>
            {nav.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className='p-4 border-t border-slate-100'>
            <div className='bg-slate-50 rounded-xl p-4'>
              <p className='text-xs font-semibold text-slate-400 uppercase mb-2'>User logged in</p>
              <p className='text-sm font-bold text-slate-700 truncate'>{user.name}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 md:ml-64 flex flex-col'>
          {/* Topbar */}
          <header className='h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10'>
            <div>
              <span className='text-xs font-bold text-emerald-600 uppercase tracking-wider'>{user.role === 'admin' ? 'Administrator' : 'Employee Portal'}</span>
              <h2 className='text-xl font-bold text-slate-800'>{title}</h2>
            </div>

            <form
              action='/api/auth/logout'
              method='post'
            >
              <button className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors'>Keluar</button>
            </form>
          </header>

          {/* Page Content */}
          <div className='p-8'>{children}</div>
        </main>
      </div>
    </>
  );
}

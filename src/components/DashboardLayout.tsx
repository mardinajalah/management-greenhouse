import Head from 'next/head';
import Link from 'next/link';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState, useSyncExternalStore } from 'react';
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

function subscribeToDesktop(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(min-width: 768px)');
  mediaQuery.addEventListener('change', callback);

  return () => {
    mediaQuery.removeEventListener('change', callback);
  };
}

function getDesktopSnapshot() {
  return typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true;
}

export function DashboardLayout({ title, user, children }: DashboardLayoutProps) {
  const router = useRouter();
  const nav = user.role === 'admin' ? adminNav : userNav;
  const isDesktop = useSyncExternalStore(subscribeToDesktop, getDesktopSnapshot, () => true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const isSidebarOpen = isDesktop ? !isDesktopSidebarCollapsed : isMobileSidebarOpen;
  const SidebarToggleIcon = isSidebarOpen ? PanelRightClose : PanelRightOpen;

  const toggleSidebar = () => {
    if (isDesktop) {
      setIsDesktopSidebarCollapsed((isCollapsed) => !isCollapsed);
      return;
    }

    setIsMobileSidebarOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = !isDesktop && isMobileSidebarOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDesktop, isMobileSidebarOpen]);

  useEffect(() => {
    const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

    router.events.on('routeChangeStart', closeMobileSidebar);

    return () => {
      router.events.off('routeChangeStart', closeMobileSidebar);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>{`${title} - Greenhouse`}</title>
      </Head>
      <div className='min-h-screen overflow-x-hidden bg-slate-50'>
        <button
          type='button'
          aria-label={isSidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
          aria-expanded={isSidebarOpen}
          onClick={toggleSidebar}
          className={`fixed top-4 z-60 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow transition-all duration-300 hover:bg-slate-50 hover:text-emerald-700 ${
            isSidebarOpen
              ? 'left-[calc(min(18rem,calc(100vw-2rem))-3.75rem)] md:left-55'
              : 'left-4'
          }`}
        >
          <span className='sr-only'>{isSidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}</span>
          <SidebarToggleIcon aria-hidden='true' size={20} strokeWidth={2} />
        </button>

        <button
          type='button'
          aria-hidden={!isMobileSidebarOpen}
          tabIndex={isMobileSidebarOpen ? 0 : -1}
          onClick={() => setIsMobileSidebarOpen(false)}
          className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
            isMobileSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-2rem))] flex-col border-r border-slate-200 bg-white shadow-2xl shadow-slate-900/10 transition-transform duration-300 ease-out md:w-72 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className='flex items-center justify-between gap-3 p-5 pr-18 sm:p-6 sm:pr-18'>
            <div className='flex min-w-0 items-center gap-3'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold text-white shadow-lg shadow-emerald-100'>GH</div>
              <div className='min-w-0'>
                <h1 className='truncate font-bold leading-none text-slate-800'>Greenhouse</h1>
                <span className='text-xs font-medium uppercase tracking-wide text-slate-500'>System</span>
              </div>
            </div>
          </div>

          <nav className='flex-1 space-y-1 overflow-y-auto px-4 py-4'>
            {nav.map((item) => {
              const isActive =
                router.pathname === item.href ||
                (item.href.endsWith('/monitorings') && router.pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (!isDesktop) {
                      setIsMobileSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className='border-t border-slate-100 p-4'>
            <div className='rounded-xl bg-slate-50 p-4'>
              <p className='mb-2 text-xs font-semibold uppercase text-slate-400'>User logged in</p>
              <p className='truncate text-sm font-bold text-slate-700'>{user.name}</p>
            </div>
          </div>
        </aside>

        <main className={`flex min-h-screen flex-col transition-[margin] duration-300 ease-out ${isDesktopSidebarCollapsed ? 'md:ml-0' : 'md:ml-72'}`}>
          <header className='sticky top-0 z-30 flex min-h-18 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-3 py-3 pl-18 backdrop-blur sm:px-5 sm:pl-20 lg:px-8 lg:pl-20'>
            <div className='min-w-0'>
              <span className='block truncate text-xs font-bold uppercase tracking-wider text-emerald-600'>{user.role === 'admin' ? 'Administrator' : 'Employee Portal'}</span>
              <h2 className='truncate text-lg font-bold text-slate-800 sm:text-xl'>{title}</h2>
            </div>

            <form
              action='/api/auth/logout'
              method='post'
            >
              <button className='flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 sm:px-4'>Keluar</button>
            </form>
          </header>

          <div className='w-full max-w-full p-3 sm:p-5 lg:p-8'>{children}</div>
        </main>
      </div>
    </>
  );
}

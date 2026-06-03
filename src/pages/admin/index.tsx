import type { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Leaderboard } from '@/components/Leaderboard';
import { serialize } from '@/lib/serialize';
import type { SessionUser } from '@/lib/session';
import { requireSession } from '@/server/auth';
import { getDashboardStats, getLeaderboard } from '@/server/data';

type AdminDashboardProps = {
  user: SessionUser;
  stats: {
    members: number;
    attendances: number;
    monitorings: number;
  };
  leaderboard: Awaited<ReturnType<typeof getLeaderboard>>;
};

export default function AdminDashboard({ user, stats, leaderboard }: AdminDashboardProps) {
  return (
    <DashboardLayout
      title='Ringkasan Admin'
      user={user}
    >
      <div className='space-y-8'>
        {/* Statistics Grid Section */}
        <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Card 1: Members */}
          <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md'>
            <div className='space-y-1'>
              <span className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Total Anggota</span>
              <p className='text-3xl font-extrabold text-slate-800'>{stats.members}</p>
            </div>
            <div className='w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
            </div>
          </div>

          {/* Card 2: Attendances */}
          <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md'>
            <div className='space-y-1'>
              <span className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Total Presensi</span>
              <p className='text-3xl font-extrabold text-slate-800'>{stats.attendances}</p>
            </div>
            <div className='w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
                />
              </svg>
            </div>
          </div>

          {/* Card 3: Monitorings */}
          <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md'>
            <div className='space-y-1'>
              <span className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Log Monitoring</span>
              <p className='text-3xl font-extrabold text-slate-800'>{stats.monitorings}</p>
            </div>
            <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Bottom Section Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Leaderboard Column */}
          <div className='lg:col-span-2'>
            <Leaderboard items={leaderboard.map((item) => ({ ...item, total: Number(item.total) }))} />
          </div>

          {/* Info Admin Panel */}
          <div className='lg:col-span-1'>
            <div className='bg-slate-800 text-white p-6 rounded-2xl shadow-sm border border-slate-900 space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-xl'>📢</div>
                <div>
                  <h3 className='font-bold text-emerald-400'>Pemberitahuan</h3>
                  <p className='text-[10px] text-slate-400 uppercase tracking-widest font-bold'>Panel Kontrol</p>
                </div>
              </div>

              <p className='text-sm text-slate-300 leading-relaxed'>
                Selamat datang kembali, <strong>{user.name}</strong>. Seluruh data monitoring dan presensi anggota telah diperbarui berdasarkan laporan manual lapangan terbaru.
              </p>

              <div className='pt-4 border-t border-slate-700/50'>
                <div className='flex items-center justify-between text-[11px] text-slate-400'>
                  <span>Status Database</span>
                  <span className='text-emerald-400 font-bold flex items-center gap-1.5'>
                    <span className='w-2 h-2 bg-emerald-400 rounded-full'></span> Terhubung
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<AdminDashboardProps> = async (context) => {
  const guard = requireSession(context, { role: 'admin' });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const [stats, leaderboard] = await Promise.all([getDashboardStats(), getLeaderboard()]);

  return {
    props: {
      user: guard.user,
      stats,
      leaderboard: serialize(leaderboard.map((item) => ({ ...item, total: Number(item.total) }))),
    },
  };
};

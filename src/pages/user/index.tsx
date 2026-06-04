import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Leaderboard } from '@/components/Leaderboard';
import { serialize } from '@/lib/serialize';
import type { SessionUser } from '@/lib/session';
import { requireSession } from '@/server/auth';
import { getLeaderboard, getUserAttendances } from '@/server/data';

type UserDashboardProps = {
  user: SessionUser;
  activeAttendances: Awaited<ReturnType<typeof getUserAttendances>>;
  leaderboard: Awaited<ReturnType<typeof getLeaderboard>>;
};

export default function UserDashboard({ user, activeAttendances, leaderboard }: UserDashboardProps) {
  return (
    <DashboardLayout
      title='Ringkasan Aktivitas'
      user={user}
    >
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column: Active Tasks */}
        <section className='lg:col-span-2 space-y-6'>
          <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
            <div className='p-6 border-b border-slate-100 flex items-center justify-between bg-white'>
              <div>
                <h2 className='text-lg font-bold text-slate-800'>Presensi Pekerjaan</h2>
                <p className='text-sm text-slate-500'>Pekerjaan yang sedang Anda kerjakan saat ini.</p>
              </div>
              <Link
                href='/user/attendances/new'
                className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-emerald-100'
              >
                + Mulai Kerja
              </Link>
            </div>

            <div className='p-6'>
              {activeAttendances.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-2xl'>☕</span>
                  </div>
                  <p className='text-slate-500 font-medium'>Tidak ada pekerjaan aktif.</p>
                  <p className='text-sm text-slate-400'>Silahkan klik tombol di atas untuk memulai.</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {activeAttendances.map((item) => (
                    <div
                      key={item.id}
                      className='flex flex-col md:flex-row md:items-center justify-between p-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors'
                    >
                      <div className='mb-4 md:mb-0'>
                        <h3 className='font-bold text-slate-700'>{item.workTitle}</h3>
                        <div className='flex items-center gap-2 mt-1 text-sm text-slate-500'>
                          <span className='flex items-center gap-1 font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs'>
                            <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse'></div>
                            Aktif
                          </span>
                          <span>• Dimulai: {item.checkInTime}</span>
                        </div>
                      </div>

                      <form
                        action={`/api/attendances/${item.id}/finish`}
                        method='post'
                        className='flex items-center gap-3'
                      >
                        <div className='flex flex-col'>
                          <label className='text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1'>Jam Selesai</label>
                          <input
                            name='checkOutTime'
                            type='time'
                            required
                            className='px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none'
                          />
                        </div>
                        <button
                          type='submit'
                          className='mt-5 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all'
                        >
                          Selesai
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Leaderboard / Sidebar Content */}
        <section className='lg:col-span-1'>
          <div className='sticky top-28'>
            <Leaderboard
              items={leaderboard.map((item) => ({ ...item, total: Number(item.total) }))}
              currentUserId={user.id}
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<UserDashboardProps> = async (context) => {
  const guard = requireSession(context, { role: 'user' });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const [attendances, leaderboard] = await Promise.all([getUserAttendances(guard.user.id), getLeaderboard()]);

  return {
    props: {
      user: guard.user,
      activeAttendances: serialize(attendances.filter((item) => item.status === 'sedang_dikerjakan')),
      leaderboard: leaderboard.map((item) => ({ ...item, total: Number(item.total) })),
    },
  };
};

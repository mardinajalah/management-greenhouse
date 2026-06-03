import type { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/DashboardLayout';
import { serialize } from '@/lib/serialize';
import type { SessionUser } from '@/lib/session';
import { requireSession } from '@/server/auth';
import { getAdminAttendances, getAttendanceTotals } from '@/server/data';

type AdminAttendancesProps = {
  user: SessionUser;
  attendances: Awaited<ReturnType<typeof getAdminAttendances>>;
  totals: Awaited<ReturnType<typeof getAttendanceTotals>>;
  query: {
    date: string;
    q: string;
    status: string;
  };
};

export default function AdminAttendancesPage({ user, attendances, totals, query }: AdminAttendancesProps) {
  // Helper untuk warna badge status
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'selesai':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'sedang_dikerjakan':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'izin':
      case 'sakit':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  return (
    <DashboardLayout
      title='Absensi Anggota'
      user={user}
    >
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* SECTION 1: FILTER DASHBOARD */}
        <section className='bg-white p-6 rounded-2xl shadow-sm border border-slate-200'>
          <div className='flex items-center gap-2 mb-6'>
            <div className='w-2 h-6 bg-emerald-500 rounded-full'></div>
            <h2 className='text-lg font-bold text-slate-800'>Filter Pencarian</h2>
          </div>
          <form
            className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end'
            method='get'
          >
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase ml-1'>Tanggal</label>
              <input
                type='date'
                name='date'
                defaultValue={query.date}
                className='w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase ml-1'>Nama Anggota</label>
              <input
                name='q'
                defaultValue={query.q}
                placeholder='Cari nama...'
                className='w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase ml-1'>Status</label>
              <select
                name='status'
                defaultValue={query.status}
                className='w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm bg-white'
              >
                <option value=''>Semua Status</option>
                <option value='sedang_dikerjakan'>Sedang dikerjakan</option>
                <option value='selesai'>Selesai</option>
                <option value='izin'>Izin</option>
                <option value='sakit'>Sakit</option>
                <option value='alpha'>Alpha</option>
              </select>
            </div>
            <button
              type='submit'
              className='bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-slate-100 text-sm h-10.5'
            >
              Terapkan Filter
            </button>
          </form>
        </section>

        {/* SECTION 2: CONTENT GRID */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* TABEL ABSENSI (KIRI - LEBIH LEBAR) */}
          <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
            <div className='p-6 border-b border-slate-100 flex justify-between items-center'>
              <h2 className='text-lg font-bold text-slate-800'>Daftar Kehadiran Hari Ini</h2>
              <span className='text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full'>{attendances.length} Record ditemukan</span>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100'>
                    <th className='px-6 py-4'>Anggota</th>
                    <th className='px-6 py-4'>Pekerjaan</th>
                    <th className='px-6 py-4'>Jam Kerja</th>
                    <th className='px-6 py-4 text-center'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                  {attendances.map((item) => (
                    <tr
                      key={item.id}
                      className='hover:bg-slate-50/50 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='font-bold text-slate-700'>{item.userName}</div>
                        <div className='text-[10px] text-slate-400 italic'>{item.attendanceDate}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-slate-600 line-clamp-1'>{item.workTitle || '-'}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2 text-xs font-medium text-slate-500'>
                          <span className='bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold'>{item.checkInTime}</span>
                          <span>→</span>
                          <span className={item.checkOutTime ? 'bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold' : 'text-emerald-500 animate-pulse font-bold'}>{item.checkOutTime || 'Aktif'}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter border ${getStatusStyle(item.status)}`}>{item.status.replace('_', ' ')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {attendances.length === 0 && <div className='p-16 text-center text-slate-400 text-sm'>Belum ada data absensi.</div>}
          </div>

          {/* TOTAL PER ANGGOTA (KANAN) */}
          <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col'>
            <div className='p-6 border-b border-slate-100'>
              <h2 className='text-lg font-bold text-slate-800'>Total Akumulasi</h2>
              <p className='text-xs text-slate-400 mt-1'>Total presensi per anggota (All Time)</p>
            </div>
            <div className='p-4 space-y-3 overflow-y-auto max-h-150'>
              {totals.map((item, index) => (
                <div
                  key={item.userName}
                  className='flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-200'>{index + 1}</div>
                    <div>
                      <div className='text-sm font-bold text-slate-700'>{item.userName}</div>
                      <div className='text-[10px] text-slate-400 uppercase tracking-widest font-bold'>Anggota Aktif</div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-xl font-black text-slate-800 leading-none'>{item.total}</div>
                    <div className='text-[10px] font-bold text-emerald-600 uppercase'>Presensi</div>
                  </div>
                </div>
              ))}
              {totals.length === 0 && <div className='p-8 text-center text-slate-400 text-xs italic'>Data tidak tersedia</div>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<AdminAttendancesProps> = async (context) => {
  const guard = requireSession(context, { role: 'admin' });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const query = {
    date: typeof context.query.date === 'string' ? context.query.date : '',
    q: typeof context.query.q === 'string' ? context.query.q : '',
    status: typeof context.query.status === 'string' ? context.query.status : '',
  };

  const [attendances, totals] = await Promise.all([getAdminAttendances(query), getAttendanceTotals()]);

  return {
    props: {
      user: guard.user,
      attendances: serialize(attendances),
      totals: serialize(totals.map((item) => ({ ...item, total: Number(item.total) }))),
      query,
    },
  };
};

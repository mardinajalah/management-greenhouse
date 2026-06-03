import type { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Message } from '@/components/Message';
import type { SessionUser } from '@/lib/session';
import { requireSession } from '@/server/auth';
import Link from 'next/link';

type NewAttendancePageProps = {
  user: SessionUser;
  today: string;
  message?: string;
};

export default function NewAttendancePage({ user, today, message }: NewAttendancePageProps) {
  return (
    <DashboardLayout
      title='Input Presensi Baru'
      user={user}
    >
      <div className='max-w-3xl mx-auto space-y-6'>
        <Message message={message} />

        <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='p-6 border-b border-slate-100'>
            <h2 className='text-lg font-bold text-slate-800 font-display'>Detail Pekerjaan</h2>
            <p className='text-sm text-slate-500'>Lengkapi formulir di bawah untuk mencatat aktivitas harian Anda.</p>
          </div>

          <form
            action='/api/attendances'
            method='post'
            className='p-8 space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Baris 1 */}
              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Tanggal</label>
                <input
                  name='attendanceDate'
                  type='date'
                  defaultValue={today}
                  required
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Status Kehadiran</label>
                <select
                  name='status'
                  defaultValue='sedang_dikerjakan'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none bg-white'
                >
                  <option value='sedang_dikerjakan'>⏳ Sedang dikerjakan</option>
                  <option value='selesai'>✅ Selesai</option>
                  <option value='izin'>📝 Izin</option>
                  <option value='sakit'>🤒 Sakit</option>
                  <option value='alpha'>❌ Alpha</option>
                </select>
              </div>

              {/* Baris 2 */}
              <div className='md:col-span-2 space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Nama Pekerjaan</label>
                <input
                  name='workTitle'
                  required
                  placeholder='Contoh: Pemupukan Area B'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              {/* Baris 3 */}
              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Jam Masuk</label>
                <input
                  name='checkInTime'
                  type='time'
                  required
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Jam Keluar (Opsional)</label>
                <input
                  name='checkOutTime'
                  type='time'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              {/* Baris 4 */}
              <div className='md:col-span-2 space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Catatan Singkat</label>
                <input
                  name='note'
                  placeholder='Misal: Selesai lebih awal'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              {/* Baris 5 */}
              <div className='md:col-span-2 space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Deskripsi Detail</label>
                <textarea
                  name='workDescription'
                  rows={3}
                  placeholder='Jelaskan apa saja yang Anda lakukan...'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>
            </div>

            <div className='pt-4 flex items-center gap-3'>
              <button
                type='submit'
                className='flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]'
              >
                Simpan Presensi
              </button>
              <Link
                href='/user/attendances'
                className='px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors'
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<NewAttendancePageProps> = async (context) => {
  const guard = requireSession(context, { role: 'user' });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  return {
    props: {
      user: guard.user,
      today: new Date().toISOString().slice(0, 10),
      message: typeof context.query.message === 'string' ? context.query.message : '',
    },
  };
};

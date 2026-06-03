import Image from 'next/image';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Message } from '@/components/Message';
import { serialize } from '@/lib/serialize';
import type { SessionUser } from '@/lib/session';
import { requireSession } from '@/server/auth';
import { getMonitoringList } from '@/server/data';

type UserMonitoringsProps = {
  user: SessionUser;
  monitorings: Awaited<ReturnType<typeof getMonitoringList>>;
  message?: string;
};

export default function UserMonitoringsPage({ user, monitorings, message }: UserMonitoringsProps) {
  return (
    <DashboardLayout
      title='Monitoring Greenhouse'
      user={user}
    >
      <div className='max-w-6xl mx-auto space-y-6'>
        <Message message={message} />

        <section className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
          {/* Header */}
          <div className='p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h2 className='text-xl font-bold text-slate-800'>Log Pengamatan Vegetasi</h2>
              <p className='text-sm text-slate-500'>Kumpulan laporan kondisi air dan pertumbuhan tanaman terbaru.</p>
            </div>
            <Link
              href='/user/monitorings/new'
              className='inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-100'
            >
              + Catat Pengamatan
            </Link>
          </div>

          {/* Table Wrap */}
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider'>
                  <th className='px-6 py-4'>Dokumentasi</th>
                  <th className='px-6 py-4'>Waktu & Inspektur</th>
                  <th className='px-6 py-4'>Kondisi Air</th>
                  <th className='px-6 py-4'>Kondisi Tanaman</th>
                  <th className='px-6 py-4 text-center'>Aksi</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {monitorings.map((item) => (
                  <tr
                    key={item.id}
                    className='hover:bg-slate-50/50 transition-colors align-middle'
                  >
                    {/* Thumbnail Foto */}
                    <td className='px-6 py-4 w-40'>
                      {item.photoUrl ? (
                        <div className='relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group aspect-4/3 w-28'>
                          <Image
                            className='object-cover transition-transform duration-200 group-hover:scale-105'
                            src={item.photoUrl}
                            alt={item.waterCondition}
                            fill
                            sizes='112px'
                          />
                        </div>
                      ) : (
                        <div className='w-28 aspect-4/3 bg-slate-100 rounded-lg flex items-center justify-center border border-dashed border-slate-200 text-xs text-slate-400 font-medium'>No Photo</div>
                      )}
                    </td>

                    {/* Tanggal & Penginput */}
                    <td className='px-6 py-4'>
                      <div className='text-sm font-bold text-slate-700'>{item.monitoringDate}</div>
                      <div className='text-xs text-slate-400 mt-0.5 flex items-center gap-1'>
                        <span className='w-1.5 h-1.5 bg-slate-400 rounded-full'></span>
                        {item.userName}
                      </div>
                    </td>

                    {/* Data Kondisi Air */}
                    <td className='px-6 py-4'>
                      <div className='text-sm font-semibold text-slate-700'>{item.waterCondition}</div>
                      <div className='mt-1'>
                        <span className='inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-bold border border-blue-100'>pH {item.waterPh}</span>
                      </div>
                    </td>

                    {/* Kondisi Tanaman */}
                    <td className='px-6 py-4'>
                      <p className='text-sm text-slate-600 line-clamp-2 max-w-xs'>{item.plantCondition}</p>
                    </td>

                    {/* Tombol Aksi */}
                    <td className='px-6 py-4 text-center'>
                      <Link
                        className='inline-flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200 shadow-sm'
                        href={`/monitorings/${item.id}`}
                      >
                        Detail Inspeksi
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {monitorings.length === 0 && (
            <div className='p-16 text-center'>
              <div className='w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-xl'>📋</span>
              </div>
              <p className='text-slate-500 text-sm font-medium'>Belum ada catatan pengamatan.</p>
              <p className='text-slate-400 text-xs mt-1'>Gunakan tombol diatas untuk memulai pencatatan manual.</p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<UserMonitoringsProps> = async (context) => {
  const guard = requireSession(context, { role: 'user' });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  return {
    props: {
      user: guard.user,
      monitorings: serialize(await getMonitoringList()),
      message: typeof context.query.message === 'string' ? context.query.message : '',
    },
  };
};

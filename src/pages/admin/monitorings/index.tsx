import Image from 'next/image';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/DashboardLayout';
import { serialize } from '@/lib/serialize';
import type { SessionUser } from '@/lib/session';
import { requireSession } from '@/server/auth';
import { getMonitoringList } from '@/server/data';

type AdminMonitoringsProps = {
  user: SessionUser;
  monitorings: Awaited<ReturnType<typeof getMonitoringList>>;
};

export default function AdminMonitoringsPage({ user, monitorings }: AdminMonitoringsProps) {
  return (
    <DashboardLayout
      title='Monitoring Greenhouse'
      user={user}
    >
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* HEADER SECTION */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm'>
          <div>
            <h2 className='text-xl font-extrabold text-slate-800'>Laporan Monitoring Terpusat</h2>
            <p className='text-sm text-slate-500 mt-1'>Menampilkan seluruh data inspeksi manual dari semua petugas lapangan.</p>
          </div>
          <div className='flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100'>
            <span className='text-emerald-600 font-bold text-lg'>{monitorings.length}</span>
            <span className='text-emerald-600 text-xs font-bold uppercase tracking-wider'>Total Laporan</span>
          </div>
        </div>

        {/* TABLE PANEL */}
        <section className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100'>
                  <th className='px-6 py-4'>Visual Documentation</th>
                  <th className='px-6 py-4'>Waktu & Inspektur</th>
                  <th className='px-6 py-4'>Kualitas Air</th>
                  <th className='px-6 py-4'>Kesehatan Tanaman</th>
                  <th className='px-6 py-4'>Status Hama</th>
                  <th className='px-6 py-4 text-center'>Tindakan</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {monitorings.map((item) => (
                  <tr
                    key={item.id}
                    className='hover:bg-slate-50/50 transition-colors group align-top'
                  >
                    {/* Thumbnail Foto */}
                    <td className='px-6 py-4 w-35'>
                      {item.photoUrl ? (
                        <div className='relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm aspect-4/3 w-24'>
                          <Image
                            className='object-cover group-hover:scale-110 transition-transform duration-300'
                            src={item.photoUrl}
                            alt={item.waterCondition}
                            fill
                            sizes='96px'
                          />
                        </div>
                      ) : (
                        <div className='w-24 aspect-4/3 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200 text-[10px] text-slate-400 font-bold uppercase'>No Image</div>
                      )}
                    </td>

                    {/* Info Tanggal & User */}
                    <td className='px-6 py-4'>
                      <div className='text-sm font-bold text-slate-700'>{item.monitoringDate}</div>
                      <div className='flex items-center gap-1.5 mt-1'>
                        <div className='w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase'>{item.userName.charAt(0)}</div>
                        <span className='text-xs text-slate-500 font-medium'>{item.userName}</span>
                      </div>
                    </td>

                    {/* Data Air */}
                    <td className='px-6 py-4'>
                      <div className='text-xs font-bold text-slate-700'>{item.waterCondition}</div>
                      <div className='mt-2 flex items-center gap-2'>
                        <span className='px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[10px] font-black'>pH {item.waterPh}</span>
                        {/* Contoh indikator suhu jika ada di data */}
                        {item.waterCondition && <span className='text-[10px] text-slate-400 font-bold'>{item.waterCondition}°C</span>}
                      </div>
                    </td>

                    {/* Kondisi Tanaman */}
                    <td className='px-6 py-4'>
                      <p className='text-xs text-slate-600 leading-relaxed max-w-50 line-clamp-3 italic'>"{item.plantCondition}"</p>
                    </td>

                    {/* Status Hama */}
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                          item.pestCondition.toLowerCase().includes('aman') || item.pestCondition.toLowerCase().includes('tidak ada') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}
                      >
                        {item.pestCondition}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className='px-6 py-4 text-center'>
                      <Link
                        className='inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-800 hover:text-white text-slate-700 text-[11px] font-bold rounded-lg transition-all border border-slate-200 shadow-sm uppercase tracking-tighter'
                        href={`/monitorings/${item.id}`}
                      >
                        Buka Laporan
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {monitorings.length === 0 && (
            <div className='py-20 text-center'>
              <div className='w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl'>📂</div>
              <h3 className='text-slate-800 font-bold'>Tidak Ada Data</h3>
              <p className='text-slate-400 text-sm'>Belum ada laporan monitoring yang masuk dari anggota.</p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<AdminMonitoringsProps> = async (context) => {
  const guard = requireSession(context, { role: 'admin' });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  return {
    props: {
      user: guard.user,
      monitorings: serialize(await getMonitoringList()),
    },
  };
};

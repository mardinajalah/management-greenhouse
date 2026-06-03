import Image from 'next/image';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Message } from '@/components/Message';
import { serialize } from '@/lib/serialize';
import type { SessionUser } from '@/lib/session';
import { requireSession } from '@/server/auth';
import { getMonitoringDetail } from '@/server/data';

type MonitoringDetailProps = {
  user: SessionUser;
  monitoring: NonNullable<Awaited<ReturnType<typeof getMonitoringDetail>>>;
  message?: string;
};

export default function MonitoringDetailPage({ user, monitoring, message }: MonitoringDetailProps) {
  return (
    <DashboardLayout
      title='Detail Laporan Monitoring'
      user={user}
    >
      <div className='max-w-5xl mx-auto space-y-6 pb-12'>
        <Message message={message} />

        {/* HEADER & NAVIGATION */}
        <div className='flex items-center justify-between'>
          <Link
            href={user.role === 'admin' ? '/admin/monitorings' : '/user/monitorings'}
            className='flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Kembali
          </Link>
          <div className='text-right'>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>ID Laporan: #{monitoring.id}</p>
            <h1 className='text-xl font-black text-slate-800'>{monitoring.monitoringDate}</h1>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* LEFT: DATA DETAILS */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Main Info Card */}
            <section className='bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden'>
              <div className='p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold'>{monitoring.user.name.charAt(0)}</div>
                  <div>
                    <p className='text-[10px] font-bold text-slate-400 uppercase'>Petugas Lapangan</p>
                    <p className='text-sm font-bold text-slate-700'>{monitoring.user.name}</p>
                  </div>
                </div>
              </div>

              <div className='p-6 grid grid-cols-2 md:grid-cols-3 gap-6'>
                <div className='space-y-1'>
                  <label className='text-[10px] font-bold text-slate-400 uppercase'>Kondisi Air</label>
                  <p className='text-sm font-semibold text-slate-700'>{monitoring.waterCondition}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] font-bold text-slate-400 uppercase'>pH Air</label>
                  <p className='text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block'>{monitoring.waterPh}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] font-bold text-slate-400 uppercase'>Suhu Air</label>
                  <p className='text-sm font-semibold text-slate-700'>{monitoring.waterTemperature}°C</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] font-bold text-slate-400 uppercase'>Suhu Udara</label>
                  <p className='text-sm font-semibold text-slate-700'>{monitoring.airTemperature}°C</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] font-bold text-slate-400 uppercase'>Kelembaban</label>
                  <p className='text-sm font-semibold text-slate-700'>{monitoring.humidity}%</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] font-bold text-slate-400 uppercase'>Hama</label>
                  <p className='text-sm font-semibold text-rose-600'>{monitoring.pestCondition}</p>
                </div>
              </div>

              <div className='p-6 bg-slate-50 border-t border-slate-100 space-y-4'>
                <div>
                  <label className='text-[10px] font-bold text-slate-400 uppercase'>Kondisi Tanaman</label>
                  <p className='text-sm text-slate-600 mt-1 italic leading-relaxed'>"{monitoring.plantCondition}"</p>
                </div>
                <div>
                  <label className='text-[10px] font-bold text-slate-400 uppercase'>Catatan Tambahan</label>
                  <p className='text-sm text-slate-600 mt-1'>{monitoring.notes || '-'}</p>
                </div>
              </div>
            </section>

            {/* Photo Gallery Card */}
            <section className='bg-white p-6 rounded-3xl shadow-sm border border-slate-200'>
              <h3 className='text-sm font-bold text-slate-800 mb-4 flex items-center gap-2'>📸 Dokumentasi Visual</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {monitoring.photos.map((photo) => (
                  <figure
                    key={photo.id}
                    className='group relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm'
                  >
                    <Image
                      src={photo.photoUrl}
                      alt={photo.caption || 'Foto monitoring'}
                      width={600}
                      height={450}
                      className='object-cover aspect-video group-hover:scale-105 transition-transform duration-500'
                    />
                    {photo.caption && <figcaption className='absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-3 text-white text-[11px] font-medium'>{photo.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: COMMENTS SECTION */}
          <div className='space-y-6'>
            <section className='bg-slate-900 text-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full min-h-125'>
              <div className='p-5 border-b border-white/10 bg-white/5'>
                <h3 className='font-bold text-emerald-400 flex items-center gap-2'>💬 Respon Admin</h3>
              </div>

              <div className='p-5 flex-1 space-y-4 overflow-y-auto max-h-100'>
                {monitoring.comments.map((item) => (
                  <div
                    className='bg-white/5 rounded-2xl p-4 border border-white/5'
                    key={item.id}
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <span className='text-xs font-black text-emerald-400 uppercase'>{item.admin.name}</span>
                      {/* PERBAIKAN HYDRATION ERROR DI SINI */}
                      <span
                        className='text-[9px] text-white/40'
                        suppressHydrationWarning
                      >
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className='text-sm text-slate-300 leading-relaxed'>{item.comment}</p>
                  </div>
                ))}
                {monitoring.comments.length === 0 && (
                  <div className='text-center py-10'>
                    <p className='text-slate-500 text-xs italic'>Belum ada tanggapan.</p>
                  </div>
                )}
              </div>

              {user.role === 'admin' && (
                <div className='p-5 bg-black/20 border-t border-white/10'>
                  <form
                    action='/api/comments'
                    method='post'
                    className='space-y-3'
                  >
                    <input
                      type='hidden'
                      name='monitoringId'
                      value={monitoring.id}
                    />
                    <textarea
                      name='comment'
                      required
                      placeholder='Tulis instruksi atau feedback...'
                      className='w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none min-h-25 transition-all'
                    />
                    <button
                      type='submit'
                      className='w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-xl transition-all'
                    >
                      Kirim Feedback
                    </button>
                  </form>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<MonitoringDetailProps> = async (context) => {
  const guard = requireSession(context);
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const id = Number(context.params?.id);
  const monitoring = Number.isInteger(id) ? await getMonitoringDetail(id) : null;

  if (!monitoring) {
    return { notFound: true };
  }

  return {
    props: {
      user: guard.user,
      monitoring: serialize(monitoring),
      message: typeof context.query.message === 'string' ? context.query.message : '',
    },
  };
};

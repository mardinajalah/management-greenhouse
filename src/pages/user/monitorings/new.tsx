import { useState, type ChangeEvent } from 'react';
import type { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Message } from '@/components/Message';
import type { SessionUser } from '@/lib/session';
import { requireSession } from '@/server/auth';
import Link from 'next/link';

type NewMonitoringProps = {
  user: SessionUser;
  today: string;
  message?: string;
};

export default function NewMonitoringPage({ user, today, message }: NewMonitoringProps) {
  const [photo, setPhoto] = useState({ data: '', name: '', type: '' });

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto({
        data: String(reader.result ?? ''),
        name: file.name,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <DashboardLayout
      title='Tambah Monitoring'
      user={user}
    >
      <div className='max-w-3xl mx-auto space-y-6'>
        <Message message={message} />

        <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='p-6 border-b border-slate-100'>
            <h2 className='text-lg font-bold text-slate-800'>Form Formulir Inspeksi Lapangan</h2>
            <p className='text-sm text-slate-500'>Catat parameter lingkungan dan fisik greenhouse secara manual.</p>
          </div>

          <form
            action='/api/monitorings'
            method='post'
            className='p-8 space-y-8'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* === SUB SECTION 1: WAKTU & INFO DASAR === */}
              <div className='md:col-span-2'>
                <h3 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-3'>1. Informasi Umum</h3>
                <div className='h-px bg-slate-100 w-full'></div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Tanggal Monitoring</label>
                <input
                  name='monitoringDate'
                  type='date'
                  defaultValue={today}
                  required
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              {/* Space kosong penyeimbang grid */}
              <div className='hidden md:block'></div>

              {/* === SUB SECTION 2: HIDROPONIK / NUTRISI AIR === */}
              <div className='md:col-span-2 pt-2'>
                <h3 className='text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3'>2. Kondisi Air & Larutan</h3>
                <div className='h-px bg-slate-100 w-full'></div>
              </div>

              <div className='md:col-span-2 space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Kondisi Air secara Fisik</label>
                <input
                  name='waterCondition'
                  required
                  placeholder='Contoh: Jernih, tidak berbau, aliran lancar'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Kadar pH Air</label>
                <input
                  name='waterPh'
                  type='number'
                  min='0'
                  max='14'
                  step='0.01'
                  required
                  placeholder='Skala 0 - 14'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Suhu Air (°C)</label>
                <input
                  name='waterTemperature'
                  type='number'
                  step='0.01'
                  required
                  placeholder='Contoh: 24.5'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              {/* === SUB SECTION 3: MIKRO KLIMAT / UDARA === */}
              <div className='md:col-span-2 pt-2'>
                <h3 className='text-xs font-bold text-blue-600 uppercase tracking-wider mb-3'>3. Parameter Udara Ruangan</h3>
                <div className='h-px bg-slate-100 w-full'></div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Suhu Udara (°C)</label>
                <input
                  name='airTemperature'
                  type='number'
                  step='0.01'
                  required
                  placeholder='Suhu termometer ruangan'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Kelembaban Ruangan (%)</label>
                <input
                  name='humidity'
                  type='number'
                  min='0'
                  max='100'
                  step='0.01'
                  required
                  placeholder='Skala 0 - 100'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              {/* === SUB SECTION 4: VEGETASI & HAMA === */}
              <div className='md:col-span-2 pt-2'>
                <h3 className='text-xs font-bold text-amber-600 uppercase tracking-wider mb-3'>4. Kondisi Tanaman & Dokumen</h3>
                <div className='h-px bg-slate-100 w-full'></div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Kondisi Pertumbuhan Tanaman</label>
                <input
                  name='plantCondition'
                  required
                  placeholder='Contoh: Daun segar, tunas baru tumbuh merata'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Kondisi Hama & Penyakit</label>
                <input
                  name='pestCondition'
                  required
                  placeholder='Contoh: Aman, atau ditemukan kutu daun di blok C'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              {/* Input File Custom */}
              <div className='space-y-1.5 md:col-span-2'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Foto Dokumentasi</label>
                <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-emerald-500 transition-colors bg-slate-50/50'>
                  <div className='space-y-1 text-center'>
                    <span className='inline-block text-2xl mb-1'>📸</span>
                    <div className='flex text-sm text-slate-600 justify-center'>
                      <label className='relative cursor-pointer bg-white rounded-md font-semibold text-emerald-600 hover:text-emerald-500 focus-within:outline-none'>
                        <span>Pilih dokumen gambar</span>
                        <input
                          type='file'
                          accept='image/jpeg,image/png,image/webp'
                          onChange={handlePhotoChange}
                          required
                          className='sr-only'
                        />
                      </label>
                    </div>
                    <p className='text-xs text-slate-400'>PNG, JPG, WEBP maksimal berkas gambar</p>
                    {photo.name && <p className='text-xs font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded mt-2 inline-block'>✓ Terpilih: {photo.name}</p>}
                  </div>
                </div>
                <input
                  type='hidden'
                  name='photoData'
                  value={photo.data}
                />
                <input
                  type='hidden'
                  name='photoName'
                  value={photo.name}
                />
                <input
                  type='hidden'
                  name='photoType'
                  value={photo.type}
                />
              </div>

              <div className='md:col-span-2 space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Caption Foto</label>
                <input
                  name='caption'
                  placeholder='Keterangan singkat mengenai foto yang diambil'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>

              <div className='md:col-span-2 space-y-1.5'>
                <label className='text-sm font-semibold text-slate-700 ml-1'>Catatan Tambahan (Opsional)</label>
                <textarea
                  name='notes'
                  rows={3}
                  placeholder='Catatan opsional di luar parameter atas...'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
                />
              </div>
            </div>

            {/* Buttons */}
            <div className='pt-4 border-t border-slate-100 flex items-center gap-3'>
              <button
                type='submit'
                className='flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]'
              >
                Simpan Log Monitoring
              </button>
              <Link
                href='/user/monitorings'
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

export const getServerSideProps: GetServerSideProps<NewMonitoringProps> = async (context) => {
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

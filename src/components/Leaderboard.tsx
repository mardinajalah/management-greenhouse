type LeaderboardItem = {
  id: number;
  name: string;
  total: number;
};

export function Leaderboard({ items }: { items: LeaderboardItem[] }) {
  return (
    <section className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
      {/* Header */}
      <div className='p-6 border-b border-slate-100 bg-linear-to-r from-emerald-50 to-white'>
        <h2 className='text-lg font-bold text-slate-800 flex items-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 text-emerald-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
            />
          </svg>
          Leaderboard Presensi
        </h2>
        <p className='text-xs text-slate-500 mt-1 font-medium italic'>Kontribusi pengerjaan terbanyak</p>
      </div>

      <div className='p-4'>
        {items.length === 0 ? (
          <div className='py-8 text-center'>
            <p className='text-sm text-slate-400'>Belum ada data presensi.</p>
          </div>
        ) : (
          <div className='space-y-2'>
            {items.map((item, index) => {
              const rank = index + 1;
              // Gaya khusus untuk top 3
              const isTopThree = rank <= 3;
              const rankStyles = {
                1: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
                2: 'bg-slate-100 text-slate-600 ring-slate-200',
                3: 'bg-orange-100 text-orange-700 ring-orange-200',
              };

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-slate-50 border border-transparent hover:border-slate-100 ${isTopThree ? 'bg-white' : ''}`}
                >
                  <div className='flex items-center gap-4'>
                    {/* Badge Peringkat */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ring-1 shadow-sm ${isTopThree ? rankStyles[rank as keyof typeof rankStyles] : 'bg-white text-slate-400 ring-slate-100'}`}>
                      {rank}
                    </div>

                    <div className='flex flex-col'>
                      <span className={`text-sm font-semibold ${isTopThree ? 'text-slate-800' : 'text-slate-600'}`}>{item.name}</span>
                      {rank === 1 && <span className='text-[10px] font-bold text-yellow-600 uppercase tracking-tight'>Best Performance</span>}
                    </div>
                  </div>

                  <div className='text-right'>
                    <span className='block text-sm font-bold text-slate-700'>{item.total}</span>
                    <span className='text-[10px] text-slate-400 uppercase font-medium'>Selesai</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className='p-4 bg-slate-50 border-t border-slate-100'>
        <p className='text-[11px] text-center text-slate-400 leading-relaxed'>Peringkat diperbarui secara otomatis setiap ada pekerjaan yang diselesaikan.</p>
      </div>
    </section>
  );
}

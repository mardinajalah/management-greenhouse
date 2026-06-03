import type { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Message } from '@/components/Message';
import { serialize } from '@/lib/serialize';
import type { SessionUser } from '@/lib/session';
import { requireSession } from '@/server/auth';
import { getMembers } from '@/server/data';

type MembersPageProps = {
  user: SessionUser;
  members: (Omit<Awaited<ReturnType<typeof getMembers>>[number], 'createdAt'> & {
    createdAt: string;
  })[];
  query: {
    q: string;
    role: string;
    status: string;
  };
  message?: string;
};

export default function MembersPage({ user, members, query, message }: MembersPageProps) {
  return (
    <DashboardLayout
      title='Manajemen Anggota'
      user={user}
    >
      <div className='max-w-6xl mx-auto space-y-8'>
        <Message message={message} />

        {/* SECTION 1: FORM TAMBAH ANGGOTA */}
        <section className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='p-6 border-b border-slate-100 flex items-center gap-3'>
            <div className='w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z' />
              </svg>
            </div>
            <h2 className='text-lg font-bold text-slate-800'>Registrasi Anggota Baru</h2>
          </div>

          <form
            className='p-6 grid grid-cols-1 md:grid-cols-3 gap-5'
            action='/api/members'
            method='post'
          >
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-500 ml-1'>Nama Lengkap</label>
              <input
                name='name'
                required
                placeholder='John Doe'
                className='w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-500 ml-1'>Email</label>
              <input
                name='email'
                type='email'
                required
                placeholder='john@example.com'
                className='w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-500 ml-1'>Username</label>
              <input
                name='username'
                placeholder='johndoe'
                className='w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-500 ml-1'>Password</label>
              <input
                name='password'
                type='password'
                minLength={6}
                required
                placeholder='••••••••'
                className='w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-500 ml-1'>Telepon</label>
              <input
                name='phone'
                placeholder='0812...'
                className='w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-bold text-slate-500 ml-1'>Role Akses</label>
              <select
                name='role'
                defaultValue='user'
                className='w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white transition-all'
              >
                <option value='user'>User / Staff</option>
                <option value='admin'>Administrator</option>
              </select>
            </div>
            <input
              type='hidden'
              name='isActive'
              value='true'
            />
            <div className='md:col-span-3 pt-2'>
              <button
                type='submit'
                className='w-full md:w-auto px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all'
              >
                Simpan Anggota
              </button>
            </div>
          </form>
        </section>

        {/* SECTION 2: DAFTAR & FILTER */}
        <section className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <h2 className='text-lg font-bold text-slate-800'>Daftar Anggota</h2>

            {/* Filter Form Inline */}
            <form
              className='flex flex-wrap items-center gap-3'
              method='get'
            >
              <input
                name='q'
                defaultValue={query.q}
                placeholder='Cari nama/email...'
                className='px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
              />
              <select
                name='role'
                defaultValue={query.role}
                className='px-3 py-1.5 text-sm rounded-lg border border-slate-200 outline-none'
              >
                <option value=''>Semua Role</option>
                <option value='admin'>Admin</option>
                <option value='user'>User</option>
              </select>
              <select
                name='status'
                defaultValue={query.status}
                className='px-3 py-1.5 text-sm rounded-lg border border-slate-200 outline-none'
              >
                <option value=''>Semua Status</option>
                <option value='active'>Aktif</option>
                <option value='inactive'>Nonaktif</option>
              </select>
              <button
                type='submit'
                className='p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors'
              >
                🔍
              </button>
            </form>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100'>
                  <th className='px-6 py-4'>Profil & Akun</th>
                  <th className='px-6 py-4'>Kontak</th>
                  <th className='px-6 py-4'>Akses</th>
                  <th className='px-6 py-4'>Status</th>
                  <th className='px-6 py-4 text-center'>Update Data</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className='hover:bg-slate-50/50 transition-colors group'
                  >
                    <td className='px-6 py-4'>
                      <div className='font-bold text-slate-700'>{member.name}</div>
                      <div className='text-xs text-slate-400'>@{member.username || 'n/a'}</div>
                    </td>
                    <td className='px-6 py-4 text-sm'>
                      <div className='text-slate-600'>{member.email}</div>
                      <div className='text-slate-400 text-xs'>{member.phone || '-'}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          member.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-1.5'>
                        <span className={`w-2 h-2 rounded-full ${member.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        <span className={`text-xs font-medium ${member.isActive ? 'text-emerald-700' : 'text-slate-500'}`}>{member.isActive ? 'Aktif' : 'Nonaktif'}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      {/* Form Edit Ringkas */}
                      <form
                        action={`/api/members/${member.id}`}
                        method='post'
                        className='flex items-center gap-2'
                      >
                        <input
                          name='name'
                          defaultValue={member.name}
                          hidden
                        />
                        <input
                          name='email'
                          defaultValue={member.email}
                          hidden
                        />

                        <div className='flex bg-slate-50 border border-slate-200 rounded-lg p-1 group-hover:bg-white transition-all'>
                          <select
                            name='role'
                            defaultValue={member.role}
                            className='bg-transparent text-[11px] font-bold px-2 outline-none border-r border-slate-200'
                          >
                            <option value='user'>USER</option>
                            <option value='admin'>ADMIN</option>
                          </select>
                          <label className='flex items-center gap-1 px-2 text-[11px] font-bold text-slate-500 cursor-pointer'>
                            <input
                              type='checkbox'
                              name='isActive'
                              defaultChecked={member.isActive}
                              className='rounded text-emerald-600'
                            />
                            AKTIF
                          </label>
                          <button
                            type='submit'
                            className='ml-1 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded shadow-sm hover:bg-emerald-700 transition-colors'
                          >
                            SAVE
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {members.length === 0 && <div className='p-12 text-center text-slate-400 text-sm italic'>Tidak ada anggota yang ditemukan.</div>}
        </section>
      </div>
    </DashboardLayout>
  );
}

// getServerSideProps tetap sama seperti kodemu karena logika datanya sudah benar
export const getServerSideProps: GetServerSideProps<MembersPageProps> = async (context) => {
  const guard = requireSession(context, { role: 'admin' });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const query = {
    q: typeof context.query.q === 'string' ? context.query.q : '',
    role: typeof context.query.role === 'string' ? context.query.role : '',
    status: typeof context.query.status === 'string' ? context.query.status : '',
  };

  const rawMembers = await getMembers(query);
  const members = rawMembers.map((member) => ({
    ...member,
    createdAt: member.createdAt.toISOString(),
  }));

  return {
    props: {
      user: guard.user,
      members: serialize(members),
      query,
      message: typeof context.query.message === 'string' ? context.query.message : '',
    },
  };
};

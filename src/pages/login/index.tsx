import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { Message } from '@/components/Message';
import { redirectIfAuthenticated } from '@/server/auth';

type LoginPageProps = {
  message?: string;
};

export default function LoginPage({ message }: LoginPageProps) {
  return (
    <>
      <Head>
        <title>Login - Greenhouse</title>
      </Head>

      {/* Background dengan gradasi lembut */}
      <main className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
        <section className='w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-100'>
          {/* Header Section */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4'>
              {/* Icon Greenhouse Sederhana */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-emerald-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-slate-800'>Masuk Dashboard</h1>
            <p className='text-slate-500 text-sm mt-2 leading-relaxed'>Kelola presensi dan monitoring kondisi greenhouse dalam satu genggaman.</p>
          </div>

          {/* Alert Message */}
          {message && (
            <div className='mb-6'>
              <Message message={message} />
            </div>
          )}

          {/* Form Section */}
          <form
            action='/api/auth/login'
            method='post'
            className='space-y-5'
          >
            <div className='space-y-1.5'>
              <label
                htmlFor='identifier'
                className='text-sm font-medium text-slate-700 ml-1'
              >
                Email atau Username
              </label>
              <input
                id='identifier'
                name='identifier'
                autoComplete='username'
                required
                placeholder='Masukkan username Anda'
                className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400'
              />
            </div>

            <div className='space-y-1.5'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-slate-700 ml-1'
              >
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                placeholder='••••••••'
                className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 active:scale-[0.98] mt-2'
            >
              Masuk Sekarang
            </button>
          </form>

          {/* Footer Sederhana */}
          <p className='text-center text-xs text-slate-400 mt-8'>&copy; {new Date().getFullYear()} Greenhouse Monitoring System</p>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<LoginPageProps> = async (context) => {
  const redirect = redirectIfAuthenticated(context);
  if (redirect) return redirect;

  return {
    props: {
      message: typeof context.query.message === 'string' ? context.query.message : '',
    },
  };
};

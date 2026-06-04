import type { ReactNode } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Message } from '@/components/Message';
import type { SessionUser } from '@/lib/session';

type MonitoringDetailLayoutProps = {
  user: SessionUser;
  title: string;
  subtitle: string;
  recordId: number;
  backHref: string;
  message?: string;
  children: ReactNode;
};

export function MonitoringDetailLayout({ user, title, subtitle, recordId, backHref, message, children }: MonitoringDetailLayoutProps) {
  return (
    <DashboardLayout
      title={title}
      user={user}
    >
      <div className='max-w-4xl mx-auto space-y-6'>
        <div>
          <Link
            href={backHref}
            className='text-sm font-semibold text-emerald-600 hover:text-emerald-800'
          >
            ← Kembali ke daftar
          </Link>
        </div>

        <Message message={message} />

        <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='p-6 border-b border-slate-100 bg-linear-to-r from-emerald-50 to-white'>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>ID #{recordId}</p>
            <h1 className='text-xl font-black text-slate-800 mt-1'>{title}</h1>
            <p className='text-sm text-slate-500 mt-1'>{subtitle}</p>
          </div>

          <div className='p-6 space-y-8'>{children}</div>
        </div>
      </div>
    </DashboardLayout>
  );
}

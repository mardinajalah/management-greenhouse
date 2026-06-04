import Link from 'next/link';

export function MonitoringBackLink({ href }: { href: string }) {
  return (
    <div className=''>
      <Link
        href={href}
        className='text-sm font-semibold text-emerald-600 py-2 px-4 rounded-xl hover:text-emerald-800'
      >
        ← Kembali
      </Link>
    </div>
  );
}

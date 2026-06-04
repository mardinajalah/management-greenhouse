import Link from "next/link";

export function MonitoringBackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="text-sm font-semibold text-emerald-600 hover:text-emerald-800">
      ← Kembali ke Monitoring
    </Link>
  );
}

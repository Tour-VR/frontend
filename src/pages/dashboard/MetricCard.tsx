import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: ReactNode;
}

/** Cartao com um numero do tour. O grupo leva o rotulo como nome acessivel. */
export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-2 text-3xl font-bold text-gray-900">{value}</dd>
    </div>
  );
}

import { Info } from 'lucide-react';
import { METRICS_PENDING_MESSAGE } from '../../constants/messages';

/** Ocupa o lugar das metricas ate o painel consumir dados reais (plano 015). */
export function MetricsPendingCard() {
  return (
    <div className="flex items-start rounded-xl border border-gray-100 bg-white p-6 text-gray-600 shadow-sm">
      <Info className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-indigo-500" />
      <p>{METRICS_PENDING_MESSAGE}</p>
    </div>
  );
}

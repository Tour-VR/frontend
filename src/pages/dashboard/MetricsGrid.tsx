import { METRIC_LABELS } from '../../constants/metrics';
import type { MetricsOverview } from '../../types';
import { MetricCard } from './MetricCard';

/** Os cinco cartoes de numeros do dashboard. */
export function MetricsGrid({ metrics }: { metrics: MetricsOverview }) {
  const { ar, vr } = metrics.visits_by_mode;

  return (
    <dl className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard label={METRIC_LABELS.pointsTotal} value={metrics.points_total} />
      <MetricCard label={METRIC_LABELS.pointsPublished} value={metrics.points_published} />
      <MetricCard label={METRIC_LABELS.visitsTotal} value={metrics.visits_total} />
      <MetricCard label={METRIC_LABELS.visitsLast7Days} value={metrics.visits_last_7_days} />
      <MetricCard
        label={METRIC_LABELS.visitsByMode}
        value={
          <span className="flex gap-6">
            <span>
              <span className="mr-1 text-sm font-medium text-gray-500">AR</span>
              {ar}
            </span>
            <span>
              <span className="mr-1 text-sm font-medium text-gray-500">VR</span>
              {vr}
            </span>
          </span>
        }
      />
    </dl>
  );
}

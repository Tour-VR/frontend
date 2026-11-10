import { dashboardMetrics } from '../../constants/dashboard';

/** Grade de cartoes de metricas do painel. */
export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {dashboardMetrics.map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">{label}</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
      ))}
    </div>
  );
}

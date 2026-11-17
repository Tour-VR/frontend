import { TOP_POINTS_EMPTY, TOP_POINTS_TITLE } from '../../constants/metrics';
import type { MetricsOverview } from '../../types';

type TopPoint = MetricsOverview['top_points'][number];

/** Ranking dos pontos com mais visitas: nome e numero. */
export function TopPointsList({ points }: { points: TopPoint[] }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{TOP_POINTS_TITLE}</h2>
      {points.length === 0 ? (
        <p className="text-gray-500">{TOP_POINTS_EMPTY}</p>
      ) : (
        <ol className="divide-y divide-gray-100">
          {points.map((point) => (
            <li key={point.slug} className="flex justify-between py-2 text-sm">
              <span className="text-gray-700">{point.name}</span>
              <span className="font-semibold text-gray-900">{point.visits}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

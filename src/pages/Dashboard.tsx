import { RefreshCw } from 'lucide-react';
import { ErrorState } from '../components/feedback/ErrorState';
import { LoadingState } from '../components/feedback/LoadingState';
import { PageHeader } from '../components/ui/PageHeader';
import { REFRESH_LABEL } from '../constants/metrics';
import { useAuth } from '../contexts/AuthContext';
import { useMetrics } from '../hooks/useMetrics';
import { MetricsGrid } from './dashboard/MetricsGrid';
import { TopPointsList } from './dashboard/TopPointsList';

export function Dashboard() {
  const { user } = useAuth();
  const { metrics, loading, error, reload } = useMetrics();
  const displayName = user?.full_name || user?.username || user?.email || 'Administrador';

  function renderBody() {
    if (loading) return <LoadingState />;
    if (error || !metrics) return <ErrorState message={error ?? ''} onRetry={reload} />;
    return (
      <>
        <MetricsGrid metrics={metrics} />
        <TopPointsList points={metrics.top_points} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Bem-vindo(a) de volta, ${displayName}.`}
        actions={
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            {REFRESH_LABEL}
          </button>
        }
      />
      {renderBody()}
    </>
  );
}

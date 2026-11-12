import { MetricsPendingCard } from '../components/dashboard/MetricsPendingCard';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.full_name || user?.username || user?.email || 'Administrador';

  return (
    <>
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Visao Geral</h2>
        <p className="mt-1 text-gray-500">Bem-vindo(a) de volta, {displayName}.</p>
      </header>

      <MetricsPendingCard />
    </>
  );
}

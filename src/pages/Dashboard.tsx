import { MetricsPendingCard } from '../components/dashboard/MetricsPendingCard';
import { PageHeader } from '../components/ui/PageHeader';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.full_name || user?.username || user?.email || 'Administrador';

  return (
    <>
      <PageHeader title="Dashboard" description={`Bem-vindo(a) de volta, ${displayName}.`} />

      <MetricsPendingCard />
    </>
  );
}

import { useNavigate } from 'react-router-dom';
import { MetricCards } from '../components/dashboard/MetricCards';
import { Sidebar } from '../components/dashboard/Sidebar';
import { UserDataPanel } from '../components/dashboard/UserDataPanel';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.full_name || user?.username || user?.email || 'Administrador';

  function handleLogout() {
    signOut();
    void navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Visao Geral</h2>
          <p className="mt-1 text-gray-500">Bem-vindo(a) de volta, {displayName}.</p>
        </header>

        <MetricCards />

        <UserDataPanel user={user} />
      </main>
    </div>
  );
}

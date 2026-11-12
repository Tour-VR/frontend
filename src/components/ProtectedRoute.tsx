import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AccessDenied } from './AccessDenied';
import { FullScreenLoader } from './FullScreenLoader';

/** Guard do painel: exige sessao e papel de administrador. */
export function ProtectedRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return isAdmin ? <Outlet /> : <AccessDenied />;
}

import { Navigate } from 'react-router-dom';
import { FullScreenLoader } from '../components/FullScreenLoader';
import { LoginForm } from '../components/login/LoginForm';
import { SessionNotice } from '../components/login/SessionNotice';
import { NO_ACCESS_HINT } from '../constants/messages';
import { useAuth } from '../contexts/AuthContext';
import { useLoginForm } from '../hooks/useLoginForm';

export function Login() {
  const { isAuthenticated, loading, sessionNotice } = useAuth();
  const form = useLoginForm();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">TourVR</h1>
          <p className="mt-2 text-gray-500">Painel administrativo</p>
        </div>

        <SessionNotice message={sessionNotice} />

        <LoginForm {...form} />

        <p className="mt-6 text-center text-xs text-gray-500">{NO_ACCESS_HINT}</p>
      </div>
    </div>
  );
}

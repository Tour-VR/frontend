import { Navigate } from 'react-router-dom';
import { FullScreenLoader } from '../components/FullScreenLoader';
import { FirstAccessNotice } from '../components/login/FirstAccessNotice';
import { LoginForm } from '../components/login/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import { useLoginForm } from '../hooks/useLoginForm';

export function Login() {
  const { isAuthenticated, loading } = useAuth();
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
          <h1 className="text-3xl font-bold text-gray-900">OculosVR</h1>
          <p className="mt-2 text-gray-500">Acesso Administrativo</p>
        </div>

        <FirstAccessNotice />

        <LoginForm {...form} />
      </div>
    </div>
  );
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { PointForm } from './pages/points/PointForm';
import { PointsList } from './pages/points/PointsList';
import { ProfilePage } from './pages/profile/ProfilePage';
import { QrCodesPage } from './pages/qrcodes/QrCodesPage';
import { UsersPage } from './pages/users/UsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pontos" element={<PointsList />} />
              <Route path="/pontos/novo" element={<PointForm />} />
              <Route path="/pontos/:pointId" element={<PointForm />} />
              <Route path="/qrcodes" element={<QrCodesPage />} />
              <Route path="/usuarios" element={<UsersPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

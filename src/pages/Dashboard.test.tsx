import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildAuthValue, buildUser } from '../test/factories';
import type { User } from '../types';
import { Dashboard } from './Dashboard';

vi.mock('../contexts/AuthContext', () => ({ useAuth: vi.fn() }));

function renderDashboard(user: User | null) {
  vi.mocked(useAuth).mockReturnValue(buildAuthValue({ user, isAuthenticated: user !== null }));
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Dashboard', () => {
  it.each([
    ['full_name', buildUser(), 'Ana Souza'],
    ['username', buildUser({ full_name: null }), 'ana'],
    ['email', buildUser({ full_name: null, username: null }), 'ana@tourvr.test'],
    ['texto padrao', null, 'Administrador'],
  ])('exibe o nome usando %s', (_field, user, expectedName) => {
    renderDashboard(user);

    expect(screen.getByText(`Bem-vindo(a) de volta, ${expectedName}.`)).toBeInTheDocument();
  });

  it('mostra metricas e os dados de /users/me', () => {
    renderDashboard(buildUser());

    expect(screen.getByText('Usuarios Ativos')).toBeInTheDocument();
    expect(screen.getByText(/"email": "ana@tourvr.test"/)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildAuthValue, buildUser } from '../test/factories';
import { AdminLayout } from './AdminLayout';

vi.mock('../contexts/AuthContext', () => ({ useAuth: vi.fn() }));

function renderLayout(signOut = vi.fn()) {
  vi.mocked(useAuth).mockReturnValue(
    buildAuthValue({ user: buildUser(), isAuthenticated: true, isAdmin: true, signOut }),
  );
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<p>Tela filha</p>} />
        </Route>
        <Route path="/login" element={<p>Pagina de login</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AdminLayout', () => {
  it('mostra o titulo, o menu e a tela filha', () => {
    renderLayout();

    expect(screen.getByText('TourVR Admin')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('Tela filha')).toBeInTheDocument();
  });

  it('sair chama signOut e navega para /login', async () => {
    const signOut = vi.fn();
    renderLayout(signOut);

    await userEvent.click(screen.getByRole('button', { name: 'Sair do sistema' }));

    expect(signOut).toHaveBeenCalled();
    expect(screen.getByText('Pagina de login')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildAuthValue, buildUser } from '../test/factories';
import { ProtectedRoute } from './ProtectedRoute';

vi.mock('../contexts/AuthContext', () => ({ useAuth: vi.fn() }));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<p>Pagina de login</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<p>Conteudo protegido</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('mostra o loader enquanto a sessao carrega', () => {
    vi.mocked(useAuth).mockReturnValue(buildAuthValue({ loading: true }));

    renderAt('/dashboard');

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.queryByText('Conteudo protegido')).not.toBeInTheDocument();
  });

  it('redireciona para /login sem sessao', () => {
    vi.mocked(useAuth).mockReturnValue(buildAuthValue());

    renderAt('/dashboard');

    expect(screen.getByText('Pagina de login')).toBeInTheDocument();
  });

  it('renderiza a rota filha para administrador', () => {
    vi.mocked(useAuth).mockReturnValue(
      buildAuthValue({ user: buildUser(), isAuthenticated: true, isAdmin: true }),
    );

    renderAt('/dashboard');

    expect(screen.getByText('Conteudo protegido')).toBeInTheDocument();
  });

  it('mostra acesso restrito para quem nao e administrador', async () => {
    const signOut = vi.fn();
    vi.mocked(useAuth).mockReturnValue(
      buildAuthValue({
        user: buildUser({ role: 'user' }),
        isAuthenticated: true,
        isAdmin: false,
        signOut,
      }),
    );

    renderAt('/dashboard');

    expect(screen.getByText('Acesso restrito a administradores.')).toBeInTheDocument();
    expect(screen.queryByText('Conteudo protegido')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Sair' }));

    expect(signOut).toHaveBeenCalled();
  });
});

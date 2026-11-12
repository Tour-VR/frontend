import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildAuthValue, buildUser } from '../test/factories';
import { stubMatchMedia } from '../test/matchMedia';
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

describe('AdminLayout em tela larga', () => {
  it('mostra o titulo, o menu e a tela filha, sem botao de gaveta', () => {
    renderLayout();

    expect(screen.getByText('TourVR Admin')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('Tela filha')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Abrir menu' })).toBeNull();
  });

  it('sair chama signOut e navega para /login', async () => {
    const signOut = vi.fn();
    renderLayout(signOut);

    await userEvent.click(screen.getByRole('button', { name: 'Sair do sistema' }));

    expect(signOut).toHaveBeenCalled();
    expect(screen.getByText('Pagina de login')).toBeInTheDocument();
  });
});

describe('AdminLayout em tela estreita', () => {
  beforeEach(() => {
    stubMatchMedia(true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('o menu fica fechado ate clicar em "Abrir menu"', async () => {
    renderLayout();

    expect(screen.queryByRole('link', { name: 'Dashboard' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));

    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('clicar num item fecha a gaveta', async () => {
    renderLayout();

    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    await userEvent.click(screen.getByRole('link', { name: 'Dashboard' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    expect(screen.getByText('Tela filha')).toBeInTheDocument();
  });

  it('Esc fecha a gaveta', async () => {
    renderLayout();

    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});

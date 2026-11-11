import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildAuthValue, buildUser } from '../test/factories';
import { Login } from './Login';

const postMock = vi.hoisted(() => vi.fn());

vi.mock('../services/api', () => ({
  api: { get: vi.fn(), post: postMock },
  getStoredToken: vi.fn(),
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
  API_DOCS_URL: 'http://api.test/docs',
}));

vi.mock('../contexts/AuthContext', () => ({ useAuth: vi.fn() }));

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<p>Painel</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText('Email'), 'ana@tourvr.test');
  await userEvent.type(screen.getByLabelText('Senha'), 'segredo123');
  await userEvent.click(screen.getByRole('button', { name: 'Entrar no Painel' }));
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('faz login e navega para /dashboard', async () => {
    const signIn = vi.fn().mockResolvedValue(buildUser());
    vi.mocked(useAuth).mockReturnValue(buildAuthValue({ signIn }));
    postMock.mockResolvedValue({ data: { access_token: 'jwt-123', token_type: 'bearer' } });
    renderLogin();

    await fillAndSubmit();

    expect(await screen.findByText('Painel')).toBeInTheDocument();
    expect(postMock).toHaveBeenCalledWith(
      '/auth/login',
      { email: 'ana@tourvr.test', password: 'segredo123' },
      expect.anything(),
    );
    expect(signIn).toHaveBeenCalledWith('jwt-123');
  });

  it('mostra o detail retornado pelo backend', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(useAuth).mockReturnValue(buildAuthValue());
    postMock.mockRejectedValue({ response: { data: { detail: 'Usuario inativo.' } } });
    renderLogin();

    await fillAndSubmit();

    expect(await screen.findByText('Usuario inativo.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar no Painel' })).toBeEnabled();
  });

  it('mostra a mensagem padrao quando o erro nao tem detail', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(useAuth).mockReturnValue(buildAuthValue());
    postMock.mockRejectedValue(new Error('Network Error'));
    renderLogin();

    await fillAndSubmit();

    expect(await screen.findByText('Credenciais invalidas. Tente novamente.')).toBeInTheDocument();
  });

  it('redireciona para /dashboard quando ja autenticado', () => {
    vi.mocked(useAuth).mockReturnValue(
      buildAuthValue({ user: buildUser(), isAuthenticated: true }),
    );

    renderLogin();

    expect(screen.getByText('Painel')).toBeInTheDocument();
  });

  it('mostra o loader enquanto a sessao carrega', () => {
    vi.mocked(useAuth).mockReturnValue(buildAuthValue({ loading: true }));

    renderLogin();

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('mostra o aviso de primeiro acesso com link para /docs', () => {
    vi.mocked(useAuth).mockReturnValue(buildAuthValue());

    renderLogin();

    expect(screen.getByRole('link', { name: '/docs - POST /auth/register' })).toHaveAttribute(
      'href',
      'http://api.test/docs',
    );
  });
});

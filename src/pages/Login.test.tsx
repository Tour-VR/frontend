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

  it('nao fala mais em /docs e orienta a procurar um administrador', () => {
    vi.mocked(useAuth).mockReturnValue(buildAuthValue());

    renderLogin();

    expect(screen.getByText('TourVR')).toBeInTheDocument();
    expect(
      screen.getByText('Não tem acesso? Fale com um administrador do TourVR.'),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\/docs/)).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('exibe o sessionNotice e o limpa ao enviar o formulario', async () => {
    const clearSessionNotice = vi.fn();
    vi.mocked(useAuth).mockReturnValue(
      buildAuthValue({ sessionNotice: 'Sua sessão expirou. Entre novamente.', clearSessionNotice }),
    );
    postMock.mockResolvedValue({ data: { access_token: 'jwt-123', token_type: 'bearer' } });
    renderLogin();

    expect(screen.getByRole('status')).toHaveTextContent('Sua sessão expirou. Entre novamente.');

    await fillAndSubmit();

    expect(clearSessionNotice).toHaveBeenCalled();
  });

  it('sem sessionNotice nao mostra a caixa de aviso', () => {
    vi.mocked(useAuth).mockReturnValue(buildAuthValue());

    renderLogin();

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

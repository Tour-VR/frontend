import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { buildUser } from '../test/factories';
import { AuthProvider, useAuth } from './AuthContext';

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  getStoredToken: vi.fn(),
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
  setUnauthorizedHandler: vi.fn(),
}));

vi.mock('../services/api', () => ({
  api: { get: apiMock.get, post: vi.fn() },
  getStoredToken: apiMock.getStoredToken,
  setAuthToken: apiMock.setAuthToken,
  clearAuthToken: apiMock.clearAuthToken,
  setUnauthorizedHandler: apiMock.setUnauthorizedHandler,
}));

/** Ultimo handler de 401 registrado pelo AuthProvider. */
function registeredHandler(): () => void {
  const calls = apiMock.setUnauthorizedHandler.mock.calls as [(() => void) | null][];
  const handler = calls.at(-1)?.[0];
  if (!handler) throw new Error('nenhum handler registrado');
  return handler;
}

function SessionProbe() {
  const { user, loading, isAuthenticated, isAdmin, sessionNotice, clearSessionNotice } = useAuth();
  const { signIn, signOut } = useAuth();
  return (
    <div>
      <p>loading: {String(loading)}</p>
      <p>autenticado: {String(isAuthenticated)}</p>
      <p>admin: {String(isAdmin)}</p>
      <p>usuario: {user?.email ?? 'nenhum'}</p>
      <p>aviso: {sessionNotice ?? 'nenhum'}</p>
      <button type="button" onClick={clearSessionNotice}>
        limpar aviso
      </button>
      <button
        type="button"
        onClick={() => {
          void signIn('novo-token');
        }}
      >
        entrar
      </button>
      <button type="button" onClick={signOut}>
        sair
      </button>
    </div>
  );
}

function renderProvider() {
  return render(
    <AuthProvider>
      <SessionProbe />
    </AuthProvider>,
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restaura a sessao quando o token salvo e valido', async () => {
    apiMock.getStoredToken.mockReturnValue('token-salvo');
    apiMock.get.mockResolvedValue({ data: buildUser() });

    renderProvider();

    expect(await screen.findByText('usuario: ana@tourvr.test')).toBeInTheDocument();
    expect(screen.getByText('loading: false')).toBeInTheDocument();
    expect(screen.getByText('autenticado: true')).toBeInTheDocument();
    expect(apiMock.setAuthToken).toHaveBeenCalledWith('token-salvo');
    expect(apiMock.get).toHaveBeenCalledWith('/users/me');
  });

  it('limpa o token salvo quando ele e invalido', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    apiMock.getStoredToken.mockReturnValue('token-expirado');
    apiMock.get.mockRejectedValue(new Error('401'));

    renderProvider();

    expect(await screen.findByText('loading: false')).toBeInTheDocument();
    expect(apiMock.clearAuthToken).toHaveBeenCalled();
    expect(screen.getByText('usuario: nenhum')).toBeInTheDocument();
  });

  it('termina o carregamento sem chamar a API quando nao ha token', async () => {
    apiMock.getStoredToken.mockReturnValue(null);

    renderProvider();

    expect(await screen.findByText('loading: false')).toBeInTheDocument();
    expect(apiMock.get).not.toHaveBeenCalled();
  });

  it('signIn grava o token e carrega o usuario', async () => {
    apiMock.getStoredToken.mockReturnValue(null);
    apiMock.get.mockResolvedValue({ data: buildUser() });
    renderProvider();
    await screen.findByText('loading: false');

    await userEvent.click(screen.getByRole('button', { name: 'entrar' }));

    expect(await screen.findByText('usuario: ana@tourvr.test')).toBeInTheDocument();
    expect(apiMock.setAuthToken).toHaveBeenCalledWith('novo-token');
  });

  it('signOut limpa o token e o usuario', async () => {
    apiMock.getStoredToken.mockReturnValue('token-salvo');
    apiMock.get.mockResolvedValue({ data: buildUser() });
    renderProvider();
    await screen.findByText('usuario: ana@tourvr.test');

    await userEvent.click(screen.getByRole('button', { name: 'sair' }));

    expect(apiMock.clearAuthToken).toHaveBeenCalled();
    expect(screen.getByText('usuario: nenhum')).toBeInTheDocument();
    expect(screen.getByText('autenticado: false')).toBeInTheDocument();
  });

  it('isAdmin e falso para usuario sem papel admin', async () => {
    apiMock.getStoredToken.mockReturnValue('token-salvo');
    apiMock.get.mockResolvedValue({ data: buildUser({ role: 'user' }) });

    renderProvider();

    expect(await screen.findByText('usuario: ana@tourvr.test')).toBeInTheDocument();
    expect(screen.getByText('admin: false')).toBeInTheDocument();
  });

  it('handler de 401 registrado zera o usuario e define sessionNotice', async () => {
    apiMock.getStoredToken.mockReturnValue('token-salvo');
    apiMock.get.mockResolvedValue({ data: buildUser() });
    renderProvider();
    expect(await screen.findByText('admin: true')).toBeInTheDocument();

    act(() => {
      registeredHandler()();
    });

    expect(screen.getByText('usuario: nenhum')).toBeInTheDocument();
    expect(screen.getByText('aviso: Sua sessão expirou. Entre novamente.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'limpar aviso' }));

    expect(screen.getByText('aviso: nenhum')).toBeInTheDocument();
  });

  it('remove o handler de 401 ao desmontar', async () => {
    apiMock.getStoredToken.mockReturnValue(null);
    const { unmount } = renderProvider();
    await screen.findByText('loading: false');

    unmount();

    expect(apiMock.setUnauthorizedHandler).toHaveBeenLastCalledWith(null);
  });

  it('useAuth fora do AuthProvider lanca erro em portugues', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth deve ser usado dentro de AuthProvider.',
    );
  });
});

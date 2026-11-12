import { AxiosError, type AxiosAdapter } from 'axios';
import { api, clearAuthToken, getStoredToken, setAuthToken, setUnauthorizedHandler } from './api';

/** Adaptador falso: devolve no corpo o header Authorization recebido. */
const echoAuthorization: AxiosAdapter = (config) =>
  Promise.resolve({
    data: config.headers.Authorization ?? null,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  });

/** Adaptador falso: responde com erro HTTP no status pedido. */
function failWith(status: number): AxiosAdapter {
  return (config) =>
    Promise.reject(
      new AxiosError('falha', 'ERR_BAD_RESPONSE', config, null, {
        data: { detail: 'erro' },
        status,
        statusText: 'erro',
        headers: {},
        config,
      }),
    );
}

describe('api', () => {
  afterEach(() => {
    clearAuthToken();
    setUnauthorizedHandler(null);
  });

  it('setAuthToken grava o token e getStoredToken o le', () => {
    setAuthToken('jwt-abc');

    expect(getStoredToken()).toBe('jwt-abc');
  });

  it('clearAuthToken remove o token salvo', () => {
    setAuthToken('jwt-abc');

    clearAuthToken();

    expect(getStoredToken()).toBeNull();
  });

  it('envia o header Authorization quando ha token', async () => {
    setAuthToken('jwt-abc');

    const response = await api.get('/users/me', { adapter: echoAuthorization });

    expect(response.data).toBe('Bearer jwt-abc');
  });

  it('nao envia Authorization sem token', async () => {
    const response = await api.get('/users/me', { adapter: echoAuthorization });

    expect(response.data).toBeNull();
  });

  describe('interceptor de resposta', () => {
    it('401 chama o handler e limpa o token', async () => {
      const handler = vi.fn();
      setUnauthorizedHandler(handler);
      setAuthToken('jwt-expirado');

      await expect(api.get('/users/me', { adapter: failWith(401) })).rejects.toBeInstanceOf(
        AxiosError,
      );

      expect(handler).toHaveBeenCalledTimes(1);
      expect(getStoredToken()).toBeNull();
    });

    it('401 de /auth/login nao chama o handler', async () => {
      const handler = vi.fn();
      setUnauthorizedHandler(handler);

      await expect(api.post('/auth/login', {}, { adapter: failWith(401) })).rejects.toThrow();

      expect(handler).not.toHaveBeenCalled();
    });

    it.each([403, 500])('%i nao chama o handler nem limpa o token', async (status) => {
      const handler = vi.fn();
      setUnauthorizedHandler(handler);
      setAuthToken('jwt-abc');

      await expect(api.get('/admin/points', { adapter: failWith(status) })).rejects.toThrow();

      expect(handler).not.toHaveBeenCalled();
      expect(getStoredToken()).toBe('jwt-abc');
    });

    it('401 sem handler registrado so limpa o token', async () => {
      setAuthToken('jwt-expirado');

      await expect(api.get('/users/me', { adapter: failWith(401) })).rejects.toThrow();

      expect(getStoredToken()).toBeNull();
    });

    it('erro que nao e do axios e repassado', async () => {
      const boom: AxiosAdapter = () => Promise.reject(new TypeError('quebrou'));

      await expect(api.get('/users/me', { adapter: boom })).rejects.toThrow('quebrou');
    });
  });
});

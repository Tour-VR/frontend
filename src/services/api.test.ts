import type { AxiosAdapter } from 'axios';
import { api, clearAuthToken, getStoredToken, setAuthToken } from './api';

/** Adaptador falso: devolve no corpo o header Authorization recebido. */
const echoAuthorization: AxiosAdapter = (config) =>
  Promise.resolve({
    data: config.headers.Authorization ?? null,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  });

describe('api', () => {
  afterEach(() => {
    clearAuthToken();
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
});

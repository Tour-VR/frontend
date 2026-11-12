import axios from 'axios';

const TOKEN_STORAGE_KEY = '@OculosVR:token';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export const API_DOCS_URL = `${API_BASE_URL.replace(/\/$/, '')}/docs`;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  delete api.defaults.headers.common.Authorization;
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Registra quem deve ser avisado quando a API responder 401 (sessao expirada ou invalida). */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

const LOGIN_PATH = '/auth/login';
const HTTP_UNAUTHORIZED = 401;

/** Trata o 401: limpa o token e avisa o handler, exceto no proprio login (credencial errada). */
function handleResponseError(error: unknown): Promise<never> {
  if (axios.isAxiosError(error)) {
    const isLogin = error.config?.url === LOGIN_PATH;
    if (error.response?.status === HTTP_UNAUTHORIZED && !isLogin) {
      clearAuthToken();
      unauthorizedHandler?.();
    }
  }
  return Promise.reject(error instanceof Error ? error : new Error(String(error)));
}

api.interceptors.response.use((response) => response, handleResponseError);

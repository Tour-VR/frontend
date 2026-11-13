import axios from 'axios';

export const DEFAULT_API_ERROR = 'Não foi possível concluir a operação. Tente novamente.';

interface ValidationItem {
  msg?: string;
}

/** Extrai a mensagem do backend (`detail` string ou primeira mensagem da lista 422). */
export function apiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return DEFAULT_API_ERROR;
  const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail;
  if (typeof detail === 'string' && detail) return detail;
  if (Array.isArray(detail)) {
    const first = detail[0] as ValidationItem | undefined;
    if (first?.msg) return first.msg;
  }
  return DEFAULT_API_ERROR;
}

/** Codigo HTTP da resposta de erro, ou `undefined` (ex.: erro de rede). */
export function apiErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

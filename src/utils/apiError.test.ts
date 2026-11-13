import { AxiosError, type AxiosResponse } from 'axios';
import { DEFAULT_API_ERROR, apiErrorMessage, apiErrorStatus } from './apiError';

function axiosError(status: number, data: unknown) {
  return new AxiosError('erro', 'ERR', undefined, undefined, { status, data } as AxiosResponse);
}

describe('apiErrorMessage', () => {
  it('usa detail quando e string', () => {
    expect(apiErrorMessage(axiosError(409, { detail: 'Ja existe.' }))).toBe('Ja existe.');
  });

  it('usa a primeira mensagem da lista 422', () => {
    const error = axiosError(422, { detail: [{ msg: 'Campo invalido' }, { msg: 'Outro' }] });
    expect(apiErrorMessage(error)).toBe('Campo invalido');
  });

  it('usa a mensagem padrao em erro de rede ou corpo desconhecido', () => {
    expect(apiErrorMessage(new AxiosError('Network Error'))).toBe(DEFAULT_API_ERROR);
    expect(apiErrorMessage(axiosError(422, { detail: [] }))).toBe(DEFAULT_API_ERROR);
    expect(apiErrorMessage(new Error('x'))).toBe(DEFAULT_API_ERROR);
  });
});

describe('apiErrorStatus', () => {
  it('devolve o codigo HTTP ou undefined', () => {
    expect(apiErrorStatus(axiosError(409, {}))).toBe(409);
    expect(apiErrorStatus(new Error('x'))).toBeUndefined();
  });
});

import { validatePoint } from './validatePoint';

const valid = { name: 'Biblioteca', slug: 'biblioteca', summary: 'Resumo', history: 'Historia' };

describe('validatePoint', () => {
  it('aceita valores dentro dos limites', () => {
    expect(validatePoint(valid)).toEqual({});
  });

  it.each([
    ['name', 'ab'],
    ['name', 'a'.repeat(121)],
    ['slug', 'ab'],
    ['slug', 'a'.repeat(61)],
    ['summary', ''],
    ['summary', 'a'.repeat(281)],
    ['history', ''],
    ['history', 'a'.repeat(10001)],
  ] as const)('rejeita %s fora do limite', (field, value) => {
    expect(validatePoint({ ...valid, [field]: value })[field]).toMatch(/precisa ter entre/);
  });

  it.each(['Com-Maiuscula', 'dois--hifens', '-inicio', 'com espaco'])(
    'rejeita slug fora do padrao: %s',
    (slug) => {
      expect(validatePoint({ ...valid, slug }).slug).toMatch(/letras minúsculas/);
    },
  );

  it('mensagem do nome em portugues', () => {
    expect(validatePoint({ ...valid, name: 'a' }).name).toBe(
      'O nome precisa ter entre 3 e 120 caracteres.',
    );
  });
});

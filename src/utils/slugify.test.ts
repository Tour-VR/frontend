import { slugify } from './slugify';

describe('slugify', () => {
  it('troca separadores e simbolos por hifens', () => {
    expect(slugify('Biblioteca Central — Sala 2')).toBe('biblioteca-central-sala-2');
  });

  it('remove acentos e cedilha', () => {
    expect(slugify('  Praça da Informação  ')).toBe('praca-da-informacao');
  });

  it('corta em 60 caracteres sem deixar hifen no fim', () => {
    expect(slugify(`${'a'.repeat(59)} b`)).toBe('a'.repeat(59));
    expect(slugify('x'.repeat(80))).toHaveLength(60);
  });
});

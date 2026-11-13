import {
  HISTORY_MAX,
  NAME_MAX,
  NAME_MIN,
  SLUG_MAX,
  SLUG_MIN,
  SLUG_PATTERN,
  SUMMARY_MAX,
} from '../constants/points';

export interface PointFormValues {
  name: string;
  slug: string;
  summary: string;
  history: string;
}

export type PointFormErrors = Partial<Record<keyof PointFormValues, string>>;

function lengthError(value: string, min: number, max: number, label: string) {
  const size = value.trim().length;
  return size < min || size > max
    ? `${label} precisa ter entre ${String(min)} e ${String(max)} caracteres.`
    : undefined;
}

function slugError(slug: string) {
  const sizeError = lengthError(slug, SLUG_MIN, SLUG_MAX, 'O identificador');
  if (sizeError) return sizeError;
  return SLUG_PATTERN.test(slug)
    ? undefined
    : 'Use apenas letras minúsculas, números e hífens entre palavras.';
}

/** Valida os campos com os mesmos limites do backend. Devolve uma mensagem por campo. */
export function validatePoint(values: PointFormValues): PointFormErrors {
  const errors: PointFormErrors = {};
  const checks: [keyof PointFormValues, string | undefined][] = [
    ['name', lengthError(values.name, NAME_MIN, NAME_MAX, 'O nome')],
    ['slug', slugError(values.slug)],
    ['summary', lengthError(values.summary, 1, SUMMARY_MAX, 'O resumo')],
    ['history', lengthError(values.history, 1, HISTORY_MAX, 'A história')],
  ];
  for (const [field, message] of checks) {
    if (message) errors[field] = message;
  }
  return errors;
}

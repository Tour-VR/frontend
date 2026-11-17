export const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_RULE_MESSAGE =
  'A senha deve ter pelo menos 8 caracteres e incluir letra e número.';

/** Mesma regra do backend. Devolve a mensagem de erro, ou `null` se a senha for valida. */
export function validatePassword(password: string): string | null {
  const valid =
    password.length >= MIN_PASSWORD_LENGTH && /[A-Za-z]/.test(password) && /\d/.test(password);
  return valid ? null : PASSWORD_RULE_MESSAGE;
}

import type { UserRole } from '../types';

/** Textos e opcoes da tela de usuarios (plano 015). */

export const USERS_PAGE_SIZE = 20;

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuário' },
];

export const USER_CREATED_MESSAGE = 'Usuário criado. Informe a senha inicial à pessoa.';

export const ROLE_CHANGE_NOTICE = 'A mudança de papel vale no próximo login da pessoa.';

export const SELF_HINT = 'Você';

export const EDIT_USER_TITLE = 'Editar usuário';

export const USER_UPDATED_MESSAGE = 'Dados do usuário atualizados.';

export const SELF_EMAIL_HINT = 'Se mudar o seu próprio e-mail, você precisará entrar de novo.';

export const OTHER_EMAIL_HINT = 'A pessoa passa a entrar com o novo e-mail.';

export function roleChangeConfirmation(email: string): string {
  return `Alterar o papel de ${email}? A mudança vale no próximo login.`;
}

import { ROLE_OPTIONS, SELF_HINT } from '../../constants/users';
import type { AdminUser, UserRole } from '../../types';

interface UserRowProps {
  user: AdminUser;
  isSelf: boolean;
  onToggleActive: (user: AdminUser) => void;
  onChangeRole: (user: AdminUser, role: UserRole) => void;
}

const CELL = 'px-4 py-3 text-sm';
const BUTTON =
  'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

/** Linha da tabela de usuarios. Na linha do proprio admin, papel e botao ficam desabilitados. */
export function UserRow({ user, isSelf, onToggleActive, onChangeRole }: UserRowProps) {
  const name = user.full_name || user.username || '—';

  return (
    <tr>
      <td className={`${CELL} font-medium text-gray-900`}>
        {name}
        {isSelf ? (
          <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
            {SELF_HINT}
          </span>
        ) : null}
      </td>
      <td className={`${CELL} text-gray-600`}>{user.email}</td>
      <td className={CELL}>
        <select
          aria-label={`Papel de ${user.email}`}
          value={user.role}
          disabled={isSelf}
          onChange={(event) => {
            onChangeRole(user, event.target.value as UserRole);
          }}
          className="rounded-lg border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-100"
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </td>
      <td className={CELL}>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {user.is_active ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td className={`${CELL} text-right`}>
        <button
          type="button"
          disabled={isSelf}
          title={isSelf ? SELF_HINT : undefined}
          onClick={() => {
            onToggleActive(user);
          }}
          className={`${BUTTON} ${
            user.is_active
              ? 'border-red-300 bg-white text-red-700 hover:bg-red-50'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {user.is_active ? 'Desativar' : 'Reativar'}
        </button>
      </td>
    </tr>
  );
}

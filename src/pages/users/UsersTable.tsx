import type { AdminUser, UserRole } from '../../types';
import { UserRow } from './UserRow';

interface UsersTableProps {
  users: AdminUser[];
  currentEmail: string | undefined;
  onToggleActive: (user: AdminUser) => void;
  onChangeRole: (user: AdminUser, role: UserRole) => void;
}

const HEADERS = ['Nome', 'E-mail', 'Papel', 'Situação', ''];

/** Tabela de usuarios; a linha do admin logado e reconhecida pelo e-mail. */
export function UsersTable({ users, currentEmail, ...handlers }: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            {HEADERS.map((header, index) => (
              <th
                key={header || index}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={user.email === currentEmail}
              onToggleActive={handlers.onToggleActive}
              onChangeRole={handlers.onChangeRole}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

import type { User } from '../../types';

interface UserDataPanelProps {
  user: User | null;
}

/** Bloco com os dados crus retornados por GET /users/me. */
export function UserDataPanel({ user }: UserDataPanelProps) {
  return (
    <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-900">
        Seus Dados (retornados de /users/me)
      </h3>
      <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}

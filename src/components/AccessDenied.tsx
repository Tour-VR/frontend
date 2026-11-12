import { LogOut, ShieldAlert } from 'lucide-react';
import { ACCESS_DENIED_HINT, ACCESS_DENIED_MESSAGE } from '../constants/messages';
import { useAuth } from '../contexts/AuthContext';

/** Tela para quem tem sessao valida, mas nao e administrador. */
export function AccessDenied() {
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
        <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" />
        <h1 className="mt-4 text-xl font-bold text-gray-900">{ACCESS_DENIED_MESSAGE}</h1>
        <p className="mt-2 text-gray-500">{ACCESS_DENIED_HINT}</p>
        <button
          type="button"
          onClick={signOut}
          className="mt-6 inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
}

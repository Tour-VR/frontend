import { API_DOCS_URL } from '../../services/api';

/** Aviso de que o primeiro cadastro ainda e feito pelo Swagger do backend. */
export function FirstAccessNotice() {
  return (
    <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
      <p className="font-medium">Primeiro acesso ao MVP?</p>
      <p className="mt-1">
        O cadastro inicial ainda acontece no backend. Crie o usuario em{' '}
        <a href={API_DOCS_URL} target="_blank" rel="noreferrer" className="font-semibold underline">
          /docs - POST /auth/register
        </a>{' '}
        e depois volte para fazer login aqui.
      </p>
    </div>
  );
}

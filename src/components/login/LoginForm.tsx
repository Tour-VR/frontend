import { Lock, Mail } from 'lucide-react';
import type { LoginFormState } from '../../hooks/useLoginForm';
import { IconInput } from './IconInput';

/** Mensagem de erro, campos de e-mail e senha e botao de envio. */
export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  isLoading,
  submit,
}: LoginFormState) {
  return (
    <>
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={(event) => {
          void submit(event);
        }}
        className="space-y-5"
      >
        <IconInput
          label="Email"
          icon={Mail}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="voce@exemplo.com"
        />

        <IconInput
          label="Senha"
          icon={Lock}
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="********"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {isLoading ? 'Entrando...' : 'Entrar no Painel'}
        </button>
      </form>
    </>
  );
}

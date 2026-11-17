import type { ReactNode } from 'react';

interface FormCardProps {
  title: string;
  submitLabel: string;
  submitting: boolean;
  error?: string | null;
  success?: string | null;
  onSubmit: () => void;
  children: ReactNode;
}

/** Cartao de formulario com titulo, botao de envio e mensagens de erro e sucesso. */
export function FormCard({ title, submitLabel, submitting, onSubmit, ...rest }: FormCardProps) {
  const { error, success, children } = rest;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="text-sm text-green-700">
          {success}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="shadow-button rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Salvando...' : submitLabel}
      </button>
    </form>
  );
}

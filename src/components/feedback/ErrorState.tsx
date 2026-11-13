interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/** Mensagem de erro com o botao "Tentar novamente". */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

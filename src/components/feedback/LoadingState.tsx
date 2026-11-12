import { Spinner } from '../ui/Spinner';

interface LoadingStateProps {
  message?: string;
}

/** Indicador de carregamento centralizado para listagens e formularios. */
export function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-12 text-gray-500">
      <Spinner />
      <span>{message}</span>
    </div>
  );
}

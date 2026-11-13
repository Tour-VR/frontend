import type { Point } from '../../types';

interface PointFormActionsProps {
  point: Point | null;
  submitting: boolean;
  busy: boolean;
  onTogglePublish: (point: Point) => void;
  onDelete: (point: Point) => void;
}

const SECONDARY =
  'rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50';

/** Botoes do formulario: Salvar e, na edicao, Publicar/Despublicar e Excluir. */
export function PointFormActions({ point, submitting, busy, ...handlers }: PointFormActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        disabled={submitting}
        className="shadow-button rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Salvando...' : 'Salvar'}
      </button>
      {point ? (
        <>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              handlers.onTogglePublish(point);
            }}
            className={`${SECONDARY} border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}
          >
            {point.status === 'published' ? 'Despublicar' : 'Publicar'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              handlers.onDelete(point);
            }}
            className={`${SECONDARY} border-red-300 bg-white text-red-700 hover:bg-red-50`}
          >
            Excluir
          </button>
        </>
      ) : null}
    </div>
  );
}

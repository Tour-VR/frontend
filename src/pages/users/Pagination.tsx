interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const BUTTON =
  'rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50';

/** "Anterior" / "Proxima" com o indicador "Pagina X de Y". */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <nav aria-label="Paginação" className="mt-4 flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => {
          onChange(page - 1);
        }}
        className={BUTTON}
      >
        Anterior
      </button>
      <span className="text-sm text-gray-600">{`Página ${String(page)} de ${String(totalPages)}`}</span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => {
          onChange(page + 1);
        }}
        className={BUTTON}
      >
        Próxima
      </button>
    </nav>
  );
}

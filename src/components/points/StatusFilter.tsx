import type { PointStatus } from '../../types';

const OPTIONS: { label: string; value: PointStatus | undefined }[] = [
  { label: 'Todos', value: undefined },
  { label: 'Rascunhos', value: 'draft' },
  { label: 'Publicados', value: 'published' },
];

interface StatusFilterProps {
  value: PointStatus | undefined;
  onChange: (value: PointStatus | undefined) => void;
}

/** Botoes de filtro por status da lista de pontos. */
export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div role="group" aria-label="Filtrar por status" className="flex gap-1">
      {OPTIONS.map((option) => (
        <button
          key={option.label}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => {
            onChange(option.value);
          }}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === option.value
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

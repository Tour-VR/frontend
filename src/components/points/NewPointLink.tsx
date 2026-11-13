import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

/** Botao "Novo ponto", usado no cabecalho e na lista vazia. */
export function NewPointLink() {
  return (
    <Link
      to="/pontos/novo"
      className="shadow-button inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
    >
      <Plus className="h-4 w-4" />
      Novo ponto
    </Link>
  );
}

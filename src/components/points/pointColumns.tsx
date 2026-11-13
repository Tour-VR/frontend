import { Link } from 'react-router-dom';
import type { Point } from '../../types';
import type { DataTableColumn } from '../ui/DataTable';
import { RowActions } from '../ui/RowActions';
import { QrCodeLink } from './QrCodeLink';
import { StatusBadge } from './StatusBadge';

interface ColumnHandlers {
  onTogglePublish: (point: Point) => void;
  onDelete: (point: Point) => void;
}

function actionsFor(point: Point, { onTogglePublish, onDelete }: ColumnHandlers) {
  return [
    {
      label: point.status === 'published' ? 'Despublicar' : 'Publicar',
      onSelect: () => {
        onTogglePublish(point);
      },
    },
    {
      label: 'Excluir',
      danger: true,
      onSelect: () => {
        onDelete(point);
      },
    },
  ];
}

/** Colunas da tabela de pontos: nome, identificador, status, atualizacao e acoes. */
export function pointColumns(handlers: ColumnHandlers): DataTableColumn<Point>[] {
  return [
    {
      key: 'name',
      header: 'Nome',
      render: (point) => (
        <Link to={`/pontos/${point.id}`} className="font-medium text-indigo-700 hover:underline">
          {point.name}
        </Link>
      ),
    },
    { key: 'slug', header: 'Identificador', render: (point) => point.slug },
    { key: 'status', header: 'Status', render: (point) => <StatusBadge status={point.status} /> },
    {
      key: 'updated_at',
      header: 'Atualizado em',
      render: (point) => new Date(point.updated_at).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Ações</span>,
      render: (point) => (
        <div className="flex items-center justify-end gap-2">
          {point.status === 'published' ? <QrCodeLink slug={point.slug} /> : null}
          <RowActions
            label={`Ações do ponto ${point.name}`}
            actions={actionsFor(point, handlers)}
          />
        </div>
      ),
    },
  ];
}

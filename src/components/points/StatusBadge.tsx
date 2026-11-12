import { STATUS_LABEL } from '../../constants/points';
import type { PointStatus } from '../../types';

const STYLE: Record<PointStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-800',
};

/** Selo do status: "Rascunho" cinza, "Publicado" verde. */
export function StatusBadge({ status }: { status: PointStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

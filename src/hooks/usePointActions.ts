import { useState } from 'react';
import { POINT_MESSAGES } from '../constants/points';
import { deletePoint, publishPoint, unpublishPoint } from '../services/points';
import type { Point } from '../types';
import { apiErrorMessage } from '../utils/apiError';

interface PointActionCallbacks {
  onChanged: (point: Point) => void | Promise<void>;
  onDeleted: () => void | Promise<void>;
}

/** Publicar, despublicar e excluir (com confirmacao). Usado pela lista e pelo formulario. */
export function usePointActions({ onChanged, onDeleted }: PointActionCallbacks) {
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function togglePublish(point: Point) {
    const call = point.status === 'published' ? unpublishPoint : publishPoint;
    return run(async () => {
      await onChanged(await call(point.id));
    });
  }

  function remove(point: Point) {
    if (!window.confirm(POINT_MESSAGES.confirmDelete(point.name))) return Promise.resolve();
    return run(async () => {
      await deletePoint(point.id);
      await onDeleted();
    });
  }

  return { busy, actionError, togglePublish, remove };
}

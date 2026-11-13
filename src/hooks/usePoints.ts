import { useCallback, useEffect, useState } from 'react';
import { listPoints } from '../services/points';
import type { Point, PointStatus } from '../types';
import { apiErrorMessage } from '../utils/apiError';

interface ListResult {
  key: string;
  points: Point[];
  error: string | null;
}

/** Lista de pontos com filtro por status. `reload` busca de novo apos uma acao. */
export function usePoints(status?: PointStatus) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<ListResult | null>(null);
  // Cada busca tem uma chave; enquanto a resposta da chave atual nao chega, esta carregando.
  const key = `${status ?? 'all'}:${String(version)}`;

  useEffect(() => {
    let active = true;
    listPoints(status)
      .then((points) => {
        if (active) setResult({ key, points, error: null });
      })
      .catch((err: unknown) => {
        if (active) setResult({ key, points: [], error: apiErrorMessage(err) });
      });
    return () => {
      active = false;
    };
  }, [key, status]);

  const reload = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  const loading = result?.key !== key;
  return {
    points: loading ? [] : result.points,
    loading,
    error: loading ? null : result.error,
    reload,
  };
}

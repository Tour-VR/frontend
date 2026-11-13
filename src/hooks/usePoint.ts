import { useCallback, useEffect, useState } from 'react';
import { getPoint } from '../services/points';
import type { Point } from '../types';
import { apiErrorMessage } from '../utils/apiError';

interface PointResult {
  id: string;
  point: Point | null;
  error: string | null;
}

/** Carrega um ponto pelo id. Sem `id` (modo criacao) nao chama a API. */
export function usePoint(id: string | undefined) {
  const [result, setResult] = useState<PointResult | null>(null);

  useEffect(() => {
    if (id === undefined) return;
    let active = true;
    getPoint(id)
      .then((point) => {
        if (active) setResult({ id, point, error: null });
      })
      .catch((err: unknown) => {
        if (active) setResult({ id, point: null, error: apiErrorMessage(err) });
      });
    return () => {
      active = false;
    };
  }, [id]);

  /** Troca o ponto carregado (ex.: depois de salvar ou publicar). */
  const setPoint = useCallback((point: Point) => {
    setResult({ id: point.id, point, error: null });
  }, []);

  const current = id !== undefined && result?.id === id ? result : null;
  return {
    point: current?.point ?? null,
    setPoint,
    loading: id !== undefined && current === null,
    error: current?.error ?? null,
  };
}

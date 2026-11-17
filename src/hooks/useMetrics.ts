import { useCallback, useEffect, useState } from 'react';
import { getMetricsOverview } from '../services/metrics';
import type { MetricsOverview } from '../types';
import { apiErrorMessage } from '../utils/apiError';

interface MetricsResult {
  version: number;
  metrics: MetricsOverview | null;
  error: string | null;
}

/** Resumo de metricas do tour. `reload` busca de novo (botao "Atualizar"). */
export function useMetrics() {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<MetricsResult | null>(null);

  useEffect(() => {
    let active = true;
    getMetricsOverview()
      .then((metrics) => {
        if (active) setResult({ version, metrics, error: null });
      })
      .catch((err: unknown) => {
        if (active) setResult({ version, metrics: null, error: apiErrorMessage(err) });
      });
    return () => {
      active = false;
    };
  }, [version]);

  const reload = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  const loading = result?.version !== version;
  return {
    metrics: loading ? null : result.metrics,
    loading,
    error: loading ? null : result.error,
    reload,
  };
}

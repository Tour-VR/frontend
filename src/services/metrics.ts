import type { MetricsOverview } from '../types';
import { api } from './api';

export async function getMetricsOverview(): Promise<MetricsOverview> {
  const { data } = await api.get<MetricsOverview>('/admin/metrics/overview');
  return data;
}

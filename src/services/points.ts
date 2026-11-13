import type { Point, PointCreate, PointStatus, PointUpdate } from '../types';
import { api } from './api';

const BASE = '/admin/points';

export async function listPoints(status?: PointStatus): Promise<Point[]> {
  const { data } = await api.get<Point[]>(BASE, { params: { status } });
  return data;
}

export async function getPoint(id: string): Promise<Point> {
  const { data } = await api.get<Point>(`${BASE}/${id}`);
  return data;
}

export async function createPoint(payload: PointCreate): Promise<Point> {
  const { data } = await api.post<Point>(BASE, payload);
  return data;
}

export async function updatePoint(id: string, payload: PointUpdate): Promise<Point> {
  const { data } = await api.put<Point>(`${BASE}/${id}`, payload);
  return data;
}

export async function deletePoint(id: string): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}

export async function publishPoint(id: string): Promise<Point> {
  const { data } = await api.post<Point>(`${BASE}/${id}/publish`);
  return data;
}

export async function unpublishPoint(id: string): Promise<Point> {
  const { data } = await api.post<Point>(`${BASE}/${id}/unpublish`);
  return data;
}

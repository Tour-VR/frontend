import type { MediaUpload } from '../types';
import { api } from './api';

/** Envia um arquivo de imagem (campo `file`) e devolve a URL relativa gravada pelo backend. */
export async function uploadMedia(file: File): Promise<MediaUpload> {
  const body = new FormData();
  body.append('file', file);
  const { data } = await api.post<MediaUpload>('/admin/media', body);
  return data;
}

import { API_BASE_URL } from '../services/api';

/** URL relativa do backend (`/media/...`) vira absoluta; URL externa segue intocada. */
export function mediaUrl(url: string): string {
  return url.startsWith('/') ? API_BASE_URL.replace(/\/$/, '') + url : url;
}

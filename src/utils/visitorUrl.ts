import { VISITOR_APP_URL } from '../constants/qr';

/** URL publica do ponto no app do visitante: `<base sem barra final>/p/<slug>`. */
export function visitorPointUrl(slug: string, base: string = VISITOR_APP_URL): string {
  return `${base.replace(/\/+$/, '')}/p/${encodeURIComponent(slug)}`;
}

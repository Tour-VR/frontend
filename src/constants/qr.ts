/** Configuracao dos QR Codes dos pontos (plano 014). */
export const DEFAULT_VISITOR_APP_URL = 'http://localhost:3001';
export const VISITOR_APP_URL: string =
  import.meta.env.VITE_VISITOR_APP_URL ?? DEFAULT_VISITOR_APP_URL;
export const QR_IMAGE_WIDTH = 512;
export const QR_ERROR_CORRECTION = 'M';
export const LOCALHOST_PREFIX = 'http://localhost';

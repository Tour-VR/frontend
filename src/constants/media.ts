// Limites espelhados do backend (plano 013). O backend continua sendo a garantia.
export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp';
export const MEDIA_MAX_MB = 20;
const BYTES_PER_MB = 1_048_576;
export const MEDIA_MAX_BYTES = MEDIA_MAX_MB * BYTES_PER_MB;
export const MEDIA_MAX_ITEMS = 20;

/**
 * Texto alternativo provisorio gravado junto com a foto recem-enviada: o backend exige
 * `alt_text` com 1 caractere ou mais. Enquanto for este texto, o painel pede o preenchimento.
 */
export const ALT_TEXT_PLACEHOLDER = 'Foto sem descrição';

export const MEDIA_MESSAGES = {
  tooLarge: `Arquivo maior que ${String(MEDIA_MAX_MB)} MB.`,
  limitReached: `Limite de ${String(MEDIA_MAX_ITEMS)} fotos`,
  altTextMissing: 'Preencha o texto alternativo',
  altTextHint: 'Descreva a imagem para quem não pode vê-la',
  uploading: 'Enviando...',
  upload: 'Enviar foto',
  empty: 'Nenhuma foto enviada ainda.',
} as const;

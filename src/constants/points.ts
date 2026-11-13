import type { PointStatus } from '../types';

// Limites espelhados do backend (plano 009). O backend continua sendo a garantia.
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_MIN = 3;
export const SLUG_MAX = 60;
export const NAME_MIN = 3;
export const NAME_MAX = 120;
export const SUMMARY_MAX = 280;
export const HISTORY_MAX = 10000;

export const STATUS_LABEL: Record<PointStatus, string> = {
  draft: 'Rascunho',
  published: 'Publicado',
};

export const POINT_MESSAGES = {
  created: 'Ponto criado.',
  saved: 'Alterações salvas.',
  slugTaken: 'Já existe um ponto com este identificador.',
  confirmDelete: (name: string) => `Excluir o ponto "${name}"? Esta ação não pode ser desfeita.`,
} as const;

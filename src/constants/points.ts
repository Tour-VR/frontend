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

// Modo VR (plano 019): limites espelhados de app/schemas/point.py.
export const MAX_CONNECTIONS = 8;
export const CONNECTION_LABEL_MAX_LENGTH = 60;
export const YAW_MIN = -180;
export const YAW_MAX = 180;
export const YAW_STEP = 5;
export const PANORAMA_RECOMMENDED_WIDTH = 4096;
export const PANORAMA_MIN_WIDTH = 2048;
export const PANORAMA_ASPECT_RATIO = 2;
export const PANORAMA_ASPECT_TOLERANCE = 0.02;

export const VR_MESSAGES = {
  panoramaHelp:
    'Use uma foto 360° equirretangular (proporção 2:1), de preferência 4096×2048 em JPEG. ' +
    'Celulares com modo panorama 360° ou câmeras 360° geram esse formato.',
  panoramaAltText: 'Panorama 360°',
  panoramaEmpty: 'Nenhum panorama enviado ainda.',
  panoramaUpload: 'Enviar panorama',
  panoramaReplace: 'Trocar panorama',
  panoramaRemove: 'Remover panorama',
  aspectWarning: 'A imagem não parece um panorama 360° (proporção 2:1).',
  tooLargeWarning: `Imagem maior que ${String(PANORAMA_RECOMMENDED_WIDTH)} px: o Quest 3 pode não exibir. Reduza para 4096×2048.`,
  tooSmallWarning: 'Imagem pequena: vai ficar borrada no óculos.',
  yawHelp: '0 = centro da foto; positivo = à direita',
  draftTarget: 'rascunho — invisível ao visitante',
  connectionsEmpty: 'Nenhuma conexão cadastrada.',
  connectionsSaved: 'Conexões salvas.',
  addConnection: 'Adicionar conexão',
  saveConnections: 'Salvar conexões',
  connectionsLimit: `Limite de ${String(MAX_CONNECTIONS)} conexões`,
  connectionIncomplete: 'Escolha o destino e escreva o rótulo de cada conexão.',
} as const;

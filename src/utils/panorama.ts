import {
  PANORAMA_ASPECT_RATIO,
  PANORAMA_ASPECT_TOLERANCE,
  PANORAMA_MIN_WIDTH,
  PANORAMA_RECOMMENDED_WIDTH,
  VR_MESSAGES,
} from '../constants/points';

export interface PanoramaCheck {
  ok: boolean;
  warnings: string[];
}

/**
 * Confere o tamanho de um panorama equirretangular. So orienta: os avisos nao bloqueiam
 * o envio (o backend nao abre a imagem; decisao do plano 019).
 */
export function checkPanoramaSize(width: number, height: number): PanoramaCheck {
  const warnings: string[] = [];
  const ratio = height > 0 ? width / height : 0;
  if (Math.abs(ratio - PANORAMA_ASPECT_RATIO) > PANORAMA_ASPECT_RATIO * PANORAMA_ASPECT_TOLERANCE) {
    warnings.push(VR_MESSAGES.aspectWarning);
  }
  if (width > PANORAMA_RECOMMENDED_WIDTH) warnings.push(VR_MESSAGES.tooLargeWarning);
  if (width < PANORAMA_MIN_WIDTH) warnings.push(VR_MESSAGES.tooSmallWarning);
  return { ok: warnings.length === 0, warnings };
}

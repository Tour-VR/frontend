import { useState } from 'react';
import { VR_MESSAGES } from '../constants/points';
import { uploadMedia } from '../services/media';
import { updatePoint } from '../services/points';
import type { MediaItem, MediaItemInput, Point } from '../types';
import { apiErrorMessage } from '../utils/apiError';
import { checkPanoramaSize } from '../utils/panorama';

interface SizeWarnings {
  url: string;
  warnings: string[];
}

/** Monta a lista `media` com as fotos atuais e, no maximo, um panorama. */
export function withPanorama(
  media: MediaItem[],
  panorama: MediaItemInput | null,
): MediaItemInput[] {
  const photos = media.filter((item) => item.kind === 'photo');
  return panorama ? [...photos, panorama] : photos;
}

/** Panorama 360° do ponto: envio, troca e remocao gravam na hora (mesmo padrao das fotos). */
export function usePanoramaField(point: Point, onSaved: (point: Point) => void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState<SizeWarnings | null>(null);
  const panorama = point.media.find((item) => item.kind === 'panorama') ?? null;

  async function persist(next: MediaItemInput | null) {
    setBusy(true);
    setError(null);
    try {
      const media = withPanorama(point.media, next);
      onSaved(await updatePoint(point.id, { media }));
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const { url } = await uploadMedia(file);
      await persist({
        kind: 'panorama',
        url,
        caption: null,
        alt_text: VR_MESSAGES.panoramaAltText,
      });
    } catch (err) {
      setError(apiErrorMessage(err));
      setBusy(false);
    }
  }

  /** Chamado quando a pre-visualizacao carrega: le o tamanho real da imagem. */
  function measure(url: string, width: number, height: number) {
    setSize({ url, warnings: checkPanoramaSize(width, height).warnings });
  }

  const warnings = panorama && size?.url === panorama.url ? size.warnings : [];
  return {
    panorama,
    busy,
    error,
    setError,
    warnings,
    upload,
    remove: () => persist(null),
    measure,
  };
}

import { useState } from 'react';
import { ALT_TEXT_PLACEHOLDER } from '../constants/media';
import { uploadMedia } from '../services/media';
import { updatePoint } from '../services/points';
import type { MediaItem, MediaItemInput, Point } from '../types';
import { apiErrorMessage } from '../utils/apiError';

/** Item da lista: o recem-enviado ainda nao tem `id` (o backend gera ao salvar). */
export type MediaDraft = MediaItemInput;

export type MediaChanges = Pick<MediaDraft, 'caption' | 'alt_text'>;

/** Texto alternativo vazio vira o provisorio, pois o backend exige ao menos 1 caractere. */
function toInput(item: MediaDraft): MediaItemInput {
  return {
    ...(item.id ? { id: item.id } : {}),
    kind: 'photo',
    url: item.url,
    caption: item.caption?.trim() ? item.caption.trim() : null,
    alt_text: item.alt_text.trim() || ALT_TEXT_PLACEHOLDER,
  };
}

function fromSaved(media: MediaItem[]): MediaDraft[] {
  return media.map((item) => ({ ...item, kind: 'photo' }));
}

/** Indica que o texto alternativo ainda nao foi escrito pelo administrador. */
export function isAltTextMissing(altText: string): boolean {
  const value = altText.trim();
  return value === '' || value === ALT_TEXT_PLACEHOLDER;
}

/** Lista de fotos de um ponto: cada alteracao grava a lista inteira com `PUT`. */
export function useMediaList(point: Point, onSaved: (point: Point) => void) {
  const [items, setItems] = useState<MediaDraft[]>(() => fromSaved(point.media));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function persist(next: MediaDraft[]) {
    const saved = await updatePoint(point.id, { media: next.map(toInput) });
    setItems(fromSaved(saved.media));
    onSaved(saved);
  }

  const add = (file: File) =>
    run(async () => {
      setUploading(true);
      try {
        const { url } = await uploadMedia(file);
        const item: MediaDraft = { kind: 'photo', url, caption: null, alt_text: '' };
        await persist([...items, item]);
      } finally {
        setUploading(false);
      }
    });

  const update = (index: number, changes: MediaChanges) =>
    run(() => persist(items.map((item, i) => (i === index ? { ...item, ...changes } : item))));

  const move = (index: number, offset: -1 | 1) =>
    run(() => {
      const next = [...items];
      next.splice(index + offset, 0, ...next.splice(index, 1));
      return persist(next);
    });

  const remove = (index: number) => run(() => persist(items.filter((_, i) => i !== index)));

  return { items, busy, uploading, error, setError, add, update, move, remove };
}

export type MediaListState = ReturnType<typeof useMediaList>;

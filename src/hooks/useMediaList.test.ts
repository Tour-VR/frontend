import { act, renderHook } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { ALT_TEXT_PLACEHOLDER } from '../constants/media';
import { uploadMedia } from '../services/media';
import { updatePoint } from '../services/points';
import { buildPoint } from '../test/factories';
import type { MediaItem } from '../types';
import { isAltTextMissing, useMediaList } from './useMediaList';

vi.mock('../services/points');
vi.mock('../services/media');

const A: MediaItem = { id: 'a', kind: 'photo', url: '/media/a.jpg', caption: null, alt_text: 'A' };
const B: MediaItem = { id: 'b', kind: 'photo', url: '/media/b.jpg', caption: 'B', alt_text: 'B' };
const point = buildPoint({ media: [A, B] });

function setup() {
  const onSaved = vi.fn();
  vi.mocked(updatePoint).mockImplementation((_id, payload) =>
    Promise.resolve(
      buildPoint({
        media: (payload.media ?? []).map((item, i) => ({
          ...item,
          id: item.id ?? `novo-${String(i)}`,
          caption: item.caption ?? null,
        })),
      }),
    ),
  );
  const hook = renderHook(() => useMediaList(point, onSaved));
  return { ...hook, onSaved };
}

function sentMedia() {
  return vi.mocked(updatePoint).mock.calls.at(-1)![1].media;
}

describe('useMediaList', () => {
  it('adiciona a foto enviada no fim com texto alternativo provisorio', async () => {
    vi.mocked(uploadMedia).mockResolvedValue({
      url: '/media/c.jpg',
      content_type: 'image/jpeg',
      size_bytes: 10,
    });
    const { result, onSaved } = setup();

    await act(() => result.current.add(new File(['x'], 'c.jpg')));

    expect(sentMedia()).toEqual([
      { id: 'a', kind: 'photo', url: '/media/a.jpg', caption: null, alt_text: 'A' },
      { id: 'b', kind: 'photo', url: '/media/b.jpg', caption: 'B', alt_text: 'B' },
      { kind: 'photo', url: '/media/c.jpg', caption: null, alt_text: ALT_TEXT_PLACEHOLDER },
    ]);
    expect(result.current.items).toHaveLength(3);
    expect(onSaved).toHaveBeenCalledOnce();
    expect(result.current.uploading).toBe(false);
  });

  it('move a foto para baixo e para cima', async () => {
    const { result } = setup();

    await act(() => result.current.move(0, 1));
    expect(sentMedia()?.map((item) => item.id)).toEqual(['b', 'a']);

    await act(() => result.current.move(1, -1));
    expect(sentMedia()?.map((item) => item.id)).toEqual(['a', 'b']);
  });

  it('remove a foto escolhida', async () => {
    const { result } = setup();

    await act(() => result.current.remove(0));

    expect(sentMedia()?.map((item) => item.id)).toEqual(['b']);
    expect(result.current.items).toHaveLength(1);
  });

  it('atualiza legenda e texto alternativo; legenda vazia vira null', async () => {
    const { result } = setup();

    await act(() => result.current.update(1, { caption: '  ', alt_text: 'Fachada' }));

    expect(sentMedia()?.[1]).toMatchObject({ id: 'b', caption: null, alt_text: 'Fachada' });
  });

  it('mostra a mensagem do backend quando a gravacao falha', async () => {
    const response = { status: 415, data: { detail: 'Formato não suportado.' } } as AxiosResponse;
    vi.mocked(uploadMedia).mockRejectedValue(
      new AxiosError('erro', '415', undefined, null, response),
    );
    const { result } = setup();

    await act(() => result.current.add(new File(['x'], 'c.jpg')));

    expect(result.current.error).toBe('Formato não suportado.');
    expect(result.current.busy).toBe(false);
    expect(updatePoint).not.toHaveBeenCalled();
  });
});

describe('isAltTextMissing', () => {
  it('considera vazio e provisorio como faltando', () => {
    expect(isAltTextMissing('')).toBe(true);
    expect(isAltTextMissing(ALT_TEXT_PLACEHOLDER)).toBe(true);
    expect(isAltTextMissing('Fachada')).toBe(false);
  });
});

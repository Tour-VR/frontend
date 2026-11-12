import { useSyncExternalStore } from 'react';

/** Telas abaixo do breakpoint md do Tailwind (768px) usam o menu em gaveta. */
export const BELOW_MD_QUERY = '(max-width: 767.98px)';

function getMediaQueryList(query: string): MediaQueryList | null {
  return typeof window.matchMedia === 'function' ? window.matchMedia(query) : null;
}

/** Diz se a media query casa agora e re-renderiza quando a janela muda de tamanho. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = getMediaQueryList(query);
      list?.addEventListener('change', onChange);
      return () => list?.removeEventListener('change', onChange);
    },
    () => getMediaQueryList(query)?.matches ?? false,
  );
}

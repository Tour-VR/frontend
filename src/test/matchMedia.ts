/**
 * O jsdom nao implementa window.matchMedia. Substitui por uma versao controlada e devolve
 * uma funcao que muda o resultado e avisa os ouvintes (simula redimensionar a janela).
 * Desfazer com vi.unstubAllGlobals().
 */
export function stubMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        return matches;
      },
      media: query,
      addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
    })),
  );
  return (next: boolean) => {
    matches = next;
    listeners.forEach((listener) => {
      listener();
    });
  };
}

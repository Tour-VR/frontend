import { act, renderHook } from '@testing-library/react';
import { stubMatchMedia } from '../test/matchMedia';
import { BELOW_MD_QUERY, useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sem matchMedia (jsdom puro) devolve false', () => {
    const { result } = renderHook(() => useMediaQuery(BELOW_MD_QUERY));

    expect(result.current).toBe(false);
  });

  it('acompanha a mudanca de tamanho da janela', () => {
    const setMatches = stubMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery(BELOW_MD_QUERY));
    expect(result.current).toBe(false);

    act(() => {
      setMatches(true);
    });

    expect(result.current).toBe(true);
  });
});

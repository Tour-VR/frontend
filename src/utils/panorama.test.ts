import { VR_MESSAGES } from '../constants/points';
import { checkPanoramaSize } from './panorama';

describe('checkPanoramaSize', () => {
  it('aceita 4096x2048 sem avisos', () => {
    expect(checkPanoramaSize(4096, 2048)).toEqual({ ok: true, warnings: [] });
  });

  it('avisa quando a imagem passa de 4096 px', () => {
    expect(checkPanoramaSize(8192, 4096)).toEqual({
      ok: false,
      warnings: [VR_MESSAGES.tooLargeWarning],
    });
  });

  it('avisa quando a proporcao nao e 2:1', () => {
    expect(checkPanoramaSize(3000, 2000).warnings).toEqual([VR_MESSAGES.aspectWarning]);
    expect(checkPanoramaSize(3000, 4000).warnings).toContain(VR_MESSAGES.aspectWarning);
  });

  it('tolera 2% de diferenca na proporcao', () => {
    expect(checkPanoramaSize(4096, 2070).ok).toBe(true);
  });

  it('avisa quando a imagem e pequena', () => {
    expect(checkPanoramaSize(1024, 512).warnings).toEqual([VR_MESSAGES.tooSmallWarning]);
  });

  it('altura zero conta como proporcao errada', () => {
    expect(checkPanoramaSize(4096, 0).warnings).toEqual([VR_MESSAGES.aspectWarning]);
  });
});

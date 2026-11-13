import QRCode from 'qrcode';
import { qrDataUrl } from './qrCode';

describe('qrDataUrl', () => {
  it('devolve um PNG em data URL', async () => {
    const url = await qrDataUrl('http://localhost:3001/p/biblioteca');
    expect(url).toMatch(/^data:image\/png;base64,/);
  });

  it('usa largura 512 e correcao de erro nivel M', async () => {
    const spy = vi.spyOn(QRCode, 'toDataURL');
    await qrDataUrl('http://x/p/a');
    expect(spy).toHaveBeenCalledWith(
      'http://x/p/a',
      expect.objectContaining({ width: 512, errorCorrectionLevel: 'M' }),
    );
  });
});

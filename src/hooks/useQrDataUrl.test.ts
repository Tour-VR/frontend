import { renderHook, waitFor } from '@testing-library/react';
import { qrDataUrl } from '../utils/qrCode';
import { QR_ERROR_MESSAGE, useQrDataUrl } from './useQrDataUrl';

vi.mock('../utils/qrCode');

describe('useQrDataUrl', () => {
  it('resolve o data URL do texto', async () => {
    vi.mocked(qrDataUrl).mockResolvedValue('data:image/png;base64,AAA');
    const { result } = renderHook(() => useQrDataUrl('http://x/p/a'));

    expect(result.current.dataUrl).toBeNull();
    await waitFor(() => {
      expect(result.current.dataUrl).toBe('data:image/png;base64,AAA');
    });
    expect(result.current.error).toBeNull();
    expect(qrDataUrl).toHaveBeenCalledWith('http://x/p/a');
  });

  it('erro na geracao vira mensagem em error', async () => {
    vi.mocked(qrDataUrl).mockRejectedValue(new Error('falha'));
    const { result } = renderHook(() => useQrDataUrl('http://x/p/a'));

    await waitFor(() => {
      expect(result.current.error).toBe(QR_ERROR_MESSAGE);
    });
    expect(result.current.dataUrl).toBeNull();
  });

  it('ignora a resposta depois de desmontado', async () => {
    let resolve: (value: string) => void = () => undefined;
    vi.mocked(qrDataUrl).mockReturnValue(
      new Promise((res) => {
        resolve = res;
      }),
    );
    const { result, unmount } = renderHook(() => useQrDataUrl('http://x/p/a'));
    unmount();
    resolve('data:image/png;base64,BBB');
    await Promise.resolve();
    expect(result.current.dataUrl).toBeNull();
  });
});

import { useEffect, useState } from 'react';
import { qrDataUrl } from '../utils/qrCode';

interface QrResult {
  text: string;
  dataUrl: string | null;
  error: string | null;
}

export const QR_ERROR_MESSAGE = 'Não foi possível gerar o QR Code.';

/** Gera o QR Code de `text`; enquanto gera, `dataUrl` e `error` ficam nulos. */
export function useQrDataUrl(text: string) {
  const [result, setResult] = useState<QrResult | null>(null);

  useEffect(() => {
    let active = true;
    qrDataUrl(text)
      .then((dataUrl) => {
        if (active) setResult({ text, dataUrl, error: null });
      })
      .catch(() => {
        if (active) setResult({ text, dataUrl: null, error: QR_ERROR_MESSAGE });
      });
    return () => {
      active = false;
    };
  }, [text]);

  const current = result?.text === text ? result : null;
  return { dataUrl: current?.dataUrl ?? null, error: current?.error ?? null };
}

import QRCode from 'qrcode';
import { QR_ERROR_CORRECTION, QR_IMAGE_WIDTH } from '../constants/qr';

/** Gera o QR Code do texto como imagem PNG em data URL (`data:image/png;base64,...`). */
export function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: QR_IMAGE_WIDTH,
    errorCorrectionLevel: QR_ERROR_CORRECTION,
    margin: 2,
  });
}

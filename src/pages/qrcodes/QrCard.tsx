import { useQrDataUrl } from '../../hooks/useQrDataUrl';
import type { Point } from '../../types';
import { visitorPointUrl } from '../../utils/visitorUrl';
import { QrDownloadLink } from './QrDownloadLink';

interface QrCardProps {
  point: Point;
}

/** Cartao imprimivel de um ponto: titulo, nome, QR Code, instrucao e URL. */
export function QrCard({ point }: QrCardProps) {
  const url = visitorPointUrl(point.slug);
  const { dataUrl, error } = useQrDataUrl(url);

  return (
    <article
      aria-label={point.name}
      className="flex break-inside-avoid flex-col items-center rounded-lg border border-gray-300 bg-white p-6 text-center"
    >
      <p className="text-sm font-semibold tracking-widest text-indigo-700 uppercase">TourVR</p>
      <h2 className="mt-2 text-xl font-bold text-gray-900">{point.name}</h2>
      <div className="mt-4 flex h-[6cm] w-[6cm] items-center justify-center">
        {dataUrl ? (
          <img src={dataUrl} alt={`QR Code de ${point.name}`} className="h-[6cm] w-[6cm]" />
        ) : (
          <p className={error ? 'text-sm text-red-600' : 'text-sm text-gray-400'}>
            {error ?? 'Gerando QR Code...'}
          </p>
        )}
      </div>
      <p className="mt-4 font-medium text-gray-700">Aponte a câmera do celular</p>
      <p className="mt-1 text-xs break-all text-gray-500">{url}</p>
      {dataUrl ? <QrDownloadLink dataUrl={dataUrl} slug={point.slug} /> : null}
    </article>
  );
}

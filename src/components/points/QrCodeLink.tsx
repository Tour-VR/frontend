import { QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QrCodeLinkProps {
  slug: string;
}

/** Atalho "QR Code" de um ponto publicado: abre /qrcodes so com aquele ponto. */
export function QrCodeLink({ slug }: QrCodeLinkProps) {
  return (
    <Link
      to={`/qrcodes?slug=${encodeURIComponent(slug)}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      <QrCode className="h-4 w-4" />
      QR Code
    </Link>
  );
}

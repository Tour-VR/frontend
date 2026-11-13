import { LOCALHOST_PREFIX, VISITOR_APP_URL } from '../../constants/qr';

export const LOCAL_URL_WARNING =
  'Estes QR Codes apontam para este computador. Ajuste VITE_VISITOR_APP_URL antes de imprimir as placas definitivas.';

interface LocalUrlWarningProps {
  baseUrl?: string;
}

/** Faixa amarela quando o QR aponta para localhost, que nao abre no celular. */
export function LocalUrlWarning({ baseUrl = VISITOR_APP_URL }: LocalUrlWarningProps) {
  if (!baseUrl.startsWith(LOCALHOST_PREFIX)) return null;
  return (
    <p
      role="note"
      className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800 print:hidden"
    >
      {LOCAL_URL_WARNING}
    </p>
  );
}

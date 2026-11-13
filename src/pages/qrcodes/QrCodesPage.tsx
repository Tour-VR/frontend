import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { LoadingState } from '../../components/feedback/LoadingState';
import { PageHeader } from '../../components/ui/PageHeader';
import { usePoints } from '../../hooks/usePoints';
import { LocalUrlWarning } from './LocalUrlWarning';
import { QrCard } from './QrCard';

export const EMPTY_QR_MESSAGE =
  'Nenhum ponto publicado. Publique um ponto em Pontos para gerar o QR Code.';

function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.print();
      }}
      className="shadow-button rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
    >
      Imprimir
    </button>
  );
}

/** /qrcodes — um cartao por ponto publicado; `?slug=` mostra so aquele ponto. */
export function QrCodesPage() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const { points, loading, error, reload } = usePoints('published');
  const visible = slug ? points.filter((point) => point.slug === slug) : points;

  function renderBody() {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} onRetry={reload} />;
    if (visible.length === 0) return <EmptyState message={EMPTY_QR_MESSAGE} />;
    return (
      <div className="qr-sheet grid grid-cols-1 gap-6 md:grid-cols-2 print:grid-cols-2">
        {visible.map((point) => (
          <QrCard key={point.id} point={point} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="print:hidden">
        <PageHeader
          title="QR Codes dos pontos"
          description="Um cartão por ponto publicado. Use Imprimir para gerar a folha A4."
          actions={<PrintButton />}
        />
      </div>
      <LocalUrlWarning />
      {renderBody()}
    </>
  );
}

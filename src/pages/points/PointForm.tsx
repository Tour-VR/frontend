import { Link, useLocation, useParams } from 'react-router-dom';
import { ErrorState } from '../../components/feedback/ErrorState';
import { LoadingState } from '../../components/feedback/LoadingState';
import { PointEditor } from '../../components/points/PointEditor';
import { StatusBadge } from '../../components/points/StatusBadge';
import { PageHeader } from '../../components/ui/PageHeader';
import { usePoint } from '../../hooks/usePoint';

const BACK_LINK = (
  <Link to="/pontos" className="text-sm font-medium text-indigo-700 hover:underline">
    Voltar para a lista
  </Link>
);

/** Tela de criacao (`/pontos/novo`) e edicao (`/pontos/:pointId`) de um ponto. */
export function PointForm() {
  const { pointId } = useParams();
  const location = useLocation();
  const { point, setPoint, loading, error } = usePoint(pointId);
  const notice = (location.state as { notice?: string } | null)?.notice ?? null;

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <PageHeader
        title={point ? point.name : 'Novo ponto'}
        description={point ? <StatusBadge status={point.status} /> : undefined}
        actions={BACK_LINK}
      />
      <PointEditor
        key={point?.id ?? 'novo'}
        point={point}
        onSaved={setPoint}
        initialNotice={notice}
      />
    </>
  );
}

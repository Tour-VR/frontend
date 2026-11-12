import { useState } from 'react';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { LoadingState } from '../../components/feedback/LoadingState';
import { NewPointLink } from '../../components/points/NewPointLink';
import { pointColumns } from '../../components/points/pointColumns';
import { StatusFilter } from '../../components/points/StatusFilter';
import { DataTable } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { Toolbar } from '../../components/ui/Toolbar';
import { usePointActions } from '../../hooks/usePointActions';
import { usePoints } from '../../hooks/usePoints';
import type { PointStatus } from '../../types';

export function PointsList() {
  const [status, setStatus] = useState<PointStatus | undefined>(undefined);
  const { points, loading, error, reload } = usePoints(status);
  const { actionError, togglePublish, remove } = usePointActions({
    onChanged: reload,
    onDeleted: reload,
  });
  const columns = pointColumns({
    onTogglePublish: (point) => void togglePublish(point),
    onDelete: (point) => void remove(point),
  });

  function renderBody() {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} onRetry={reload} />;
    if (points.length === 0 && status === undefined) {
      return <EmptyState message="Nenhum ponto cadastrado ainda." action={<NewPointLink />} />;
    }
    return (
      <DataTable
        columns={columns}
        rows={points}
        getRowId={(point) => point.id}
        emptyMessage="Nenhum ponto com este status."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Pontos do tour"
        description="Locais do campus que o visitante encontra pelo QR Code ou no modo VR."
        actions={<NewPointLink />}
      />
      <Toolbar>
        <StatusFilter value={status} onChange={setStatus} />
      </Toolbar>
      {actionError ? (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {actionError}
        </p>
      ) : null}
      {renderBody()}
    </>
  );
}

import { useNavigate } from 'react-router-dom';
import { usePointActions } from '../../hooks/usePointActions';
import { usePointForm } from '../../hooks/usePointForm';
import type { Point } from '../../types';
import { PointFields } from './PointFields';
import { PointFormActions } from './PointFormActions';

interface PointEditorProps {
  point: Point | null;
  onSaved: (point: Point) => void;
  initialNotice?: string | null;
}

/** Formulario de ponto com mensagens e acoes. Recebe `point = null` no modo criacao. */
export function PointEditor({ point, onSaved, initialNotice }: PointEditorProps) {
  const navigate = useNavigate();
  const form = usePointForm({ point, onSaved, initialNotice });
  const actions = usePointActions({
    onChanged: onSaved,
    onDeleted: () => {
      void navigate('/pontos');
    },
  });
  const message = form.apiError ?? actions.actionError;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void form.submit(event);
      }}
      className="max-w-3xl space-y-6 rounded-lg border border-gray-200 bg-white p-6"
    >
      {form.notice ? (
        <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          {form.notice}
        </p>
      ) : null}
      {message ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {message}
        </p>
      ) : null}
      <PointFields form={form} slugLocked={point?.status === 'published'} />
      <PointFormActions
        point={point}
        submitting={form.submitting}
        busy={actions.busy}
        onTogglePublish={(target) => void actions.togglePublish(target)}
        onDelete={(target) => void actions.remove(target)}
      />
    </form>
  );
}

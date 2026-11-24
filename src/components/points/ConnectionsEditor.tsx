import { VR_MESSAGES } from '../../constants/points';
import { useConnectionsEditor } from '../../hooks/useConnectionsEditor';
import type { Point } from '../../types';
import { ConnectionRow } from './ConnectionRow';

interface ConnectionsEditorProps {
  point: Point;
  onSaved: (point: Point) => void;
}

const SECONDARY_BUTTON =
  'rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50';
const PRIMARY_BUTTON =
  'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60';

/** Conexoes do modo VR: setas para os pontos vizinhos, posicionadas por angulo. */
export function ConnectionsEditor({ point, onSaved }: ConnectionsEditorProps) {
  const editor = useConnectionsEditor(point, onSaved);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">Conexões</h3>
      {editor.notice ? (
        <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          {editor.notice}
        </p>
      ) : null}
      {editor.error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {editor.error}
        </p>
      ) : null}
      {editor.rows.length === 0 ? (
        <p className="text-sm text-gray-500">{VR_MESSAGES.connectionsEmpty}</p>
      ) : (
        <ul className="space-y-3">
          {editor.rows.map((_, index) => (
            // A linha nao tem id proprio; o indice basta porque a lista so muda por botao.
            <ConnectionRow key={index} index={index} editor={editor} />
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={SECONDARY_BUTTON}
          disabled={editor.busy || editor.limitReached}
          onClick={editor.add}
        >
          {VR_MESSAGES.addConnection}
        </button>
        <button
          type="button"
          className={PRIMARY_BUTTON}
          disabled={editor.busy}
          onClick={() => void editor.save()}
        >
          {VR_MESSAGES.saveConnections}
        </button>
        {editor.limitReached ? (
          <span className="text-sm text-gray-500">{VR_MESSAGES.connectionsLimit}</span>
        ) : null}
      </div>
    </div>
  );
}

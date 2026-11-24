import { useId } from 'react';
import {
  CONNECTION_LABEL_MAX_LENGTH,
  STATUS_LABEL,
  VR_MESSAGES,
  YAW_MAX,
  YAW_MIN,
  YAW_STEP,
} from '../../constants/points';
import type { ConnectionsEditorState } from '../../hooks/useConnectionsEditor';

interface ConnectionRowProps {
  index: number;
  editor: ConnectionsEditorState;
}

const INPUT_CLASS =
  'block w-full rounded-lg border border-gray-300 px-3 py-2 sm:text-sm focus:border-indigo-500 focus:ring-indigo-500';
const LABEL_CLASS = 'mb-1 block text-sm font-medium text-gray-700';

/** Destino da conexao. Destinos usados em outras linhas ficam desabilitados. */
function TargetSelect({ index, editor }: ConnectionRowProps) {
  const id = useId();
  const row = editor.rows[index];
  const usedElsewhere = new Set(
    editor.rows.filter((_, i) => i !== index).map((item) => item.target_slug),
  );
  const target = editor.targets.find((item) => item.slug === row.target_slug);

  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        Destino
      </label>
      <select
        id={id}
        value={row.target_slug}
        className={INPUT_CLASS}
        onChange={(event) => {
          editor.setTarget(index, event.target.value);
        }}
      >
        <option value="">Escolha um ponto</option>
        {editor.targets.map((item) => (
          <option key={item.id} value={item.slug} disabled={usedElsewhere.has(item.slug)}>
            {`${item.name} (${STATUS_LABEL[item.status]})`}
          </option>
        ))}
      </select>
      {target?.status === 'draft' ? (
        <span className="mt-1 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
          {VR_MESSAGES.draftTarget}
        </span>
      ) : null}
    </div>
  );
}

/** Uma conexao: destino, rotulo e angulo horizontal (yaw). */
export function ConnectionRow({ index, editor }: ConnectionRowProps) {
  const id = useId();
  const row = editor.rows[index];

  return (
    <li className="grid gap-3 rounded-lg border border-gray-200 p-4 sm:grid-cols-[2fr_2fr_1fr_auto]">
      <TargetSelect index={index} editor={editor} />
      <div>
        <label htmlFor={`${id}-label`} className={LABEL_CLASS}>
          Rótulo
        </label>
        <input
          id={`${id}-label`}
          type="text"
          value={row.label}
          maxLength={CONNECTION_LABEL_MAX_LENGTH}
          className={INPUT_CLASS}
          onChange={(event) => {
            editor.setLabel(index, event.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor={`${id}-yaw`} className={LABEL_CLASS}>
          Ângulo
        </label>
        <input
          id={`${id}-yaw`}
          type="number"
          min={YAW_MIN}
          max={YAW_MAX}
          step={YAW_STEP}
          value={row.yaw_degrees}
          aria-describedby={`${id}-yaw-hint`}
          className={INPUT_CLASS}
          onChange={(event) => {
            editor.setYaw(index, Number(event.target.value));
          }}
        />
        <span id={`${id}-yaw-hint`} className="mt-1 block text-xs text-gray-500">
          {VR_MESSAGES.yawHelp}
        </span>
      </div>
      <div className="self-center">
        <button
          type="button"
          className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={editor.busy}
          onClick={() => {
            editor.remove(index);
          }}
        >
          Remover
        </button>
      </div>
    </li>
  );
}

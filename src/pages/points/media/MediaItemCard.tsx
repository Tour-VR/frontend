import { useId, type ReactNode } from 'react';
import { ALT_TEXT_PLACEHOLDER, MEDIA_MESSAGES } from '../../../constants/media';
import type { MediaChanges, MediaDraft } from '../../../hooks/useMediaList';
import { isAltTextMissing } from '../../../hooks/useMediaList';
import { mediaUrl } from '../../../utils/mediaUrl';

interface MediaItemCardProps {
  item: MediaDraft;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  onUpdate: (changes: MediaChanges) => void;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
}

const INPUT_CLASS =
  'block w-full rounded-lg border border-gray-300 px-3 py-2 sm:text-sm focus:border-indigo-500 focus:ring-indigo-500';
const BUTTON_CLASS =
  'rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50';

interface BlurFieldProps {
  label: string;
  defaultValue: string;
  onCommit: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
}

/** Campo de texto que salva ao sair do campo (`onBlur`). */
function BlurField({ label, defaultValue, onCommit, placeholder, children }: BlurFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={INPUT_CLASS}
        onBlur={(event) => {
          onCommit(event.target.value.trim());
        }}
      />
      {children}
    </div>
  );
}

interface CardActionsProps {
  busy: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
}

function CardActions({ busy, isFirst, isLast, onMove, onRemove }: CardActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label="Mover para cima"
        className={BUTTON_CLASS}
        disabled={busy || isFirst}
        onClick={() => {
          onMove(-1);
        }}
      >
        ↑
      </button>
      <button
        type="button"
        aria-label="Mover para baixo"
        className={BUTTON_CLASS}
        disabled={busy || isLast}
        onClick={() => {
          onMove(1);
        }}
      >
        ↓
      </button>
      <button
        type="button"
        className={`${BUTTON_CLASS} text-red-700`}
        disabled={busy}
        onClick={onRemove}
      >
        Remover
      </button>
    </div>
  );
}

/** Foto do ponto: miniatura, legenda, texto alternativo e botoes de ordem e remocao. */
export function MediaItemCard({ item, onUpdate, ...actions }: MediaItemCardProps) {
  // O provisorio nao aparece no campo: o administrador ve o campo vazio e o aviso.
  const altText = item.alt_text === ALT_TEXT_PLACEHOLDER ? '' : item.alt_text;

  function save(changes: Partial<MediaChanges>) {
    const next = { caption: item.caption ?? null, alt_text: item.alt_text, ...changes };
    if (next.caption !== (item.caption ?? null) || next.alt_text !== item.alt_text) {
      onUpdate(next);
    }
  }

  return (
    <li className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row">
      <img
        src={mediaUrl(item.url)}
        alt={item.alt_text}
        className="h-[120px] w-[120px] shrink-0 rounded-lg object-cover"
      />
      <div className="flex-1 space-y-3">
        <BlurField
          label="Legenda"
          defaultValue={item.caption ?? ''}
          onCommit={(value) => {
            save({ caption: value || null });
          }}
        />
        <BlurField
          label="Texto alternativo"
          defaultValue={altText}
          placeholder={MEDIA_MESSAGES.altTextHint}
          onCommit={(value) => {
            save({ alt_text: value || ALT_TEXT_PLACEHOLDER });
          }}
        >
          <p className="mt-1 text-xs text-gray-500">{MEDIA_MESSAGES.altTextHint}</p>
          {isAltTextMissing(item.alt_text) ? (
            <p className="mt-1 rounded bg-yellow-50 px-2 py-1 text-sm text-yellow-800">
              {MEDIA_MESSAGES.altTextMissing}
            </p>
          ) : null}
        </BlurField>
        <CardActions {...actions} />
      </div>
    </li>
  );
}

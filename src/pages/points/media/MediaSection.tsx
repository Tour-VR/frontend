import { MEDIA_MAX_ITEMS, MEDIA_MESSAGES } from '../../../constants/media';
import { useMediaList } from '../../../hooks/useMediaList';
import type { Point } from '../../../types';
import { MediaItemCard } from './MediaItemCard';
import { MediaUploadButton } from './MediaUploadButton';

interface MediaSectionProps {
  point: Point;
  onSaved: (point: Point) => void;
}

/** Secao "Fotos" da edicao do ponto: cada mudanca e gravada na hora. */
export function MediaSection({ point, onSaved }: MediaSectionProps) {
  const media = useMediaList(point, onSaved);
  const lastIndex = media.items.length - 1;

  return (
    <section
      aria-labelledby="media-title"
      className="mt-6 max-w-3xl space-y-4 rounded-lg border border-gray-200 bg-white p-6"
    >
      <h2 id="media-title" className="text-lg font-semibold text-gray-900">
        Fotos
      </h2>
      {media.error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {media.error}
        </p>
      ) : null}
      {media.items.length === 0 ? (
        <p className="text-sm text-gray-500">{MEDIA_MESSAGES.empty}</p>
      ) : (
        <ul className="space-y-3">
          {media.items.map((item, index) => (
            <MediaItemCard
              key={item.id ?? item.url}
              item={item}
              isFirst={index === 0}
              isLast={index === lastIndex}
              busy={media.busy}
              onUpdate={(changes) => void media.update(index, changes)}
              onMove={(offset) => void media.move(index, offset)}
              onRemove={() => void media.remove(index)}
            />
          ))}
        </ul>
      )}
      <MediaUploadButton
        busy={media.busy}
        uploading={media.uploading}
        limitReached={media.items.length >= MEDIA_MAX_ITEMS}
        onFile={(file) => void media.add(file)}
        onError={media.setError}
      />
    </section>
  );
}

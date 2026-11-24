import { ACCEPTED_IMAGE_TYPES, MEDIA_MAX_BYTES, MEDIA_MESSAGES } from '../../constants/media';
import { VR_MESSAGES } from '../../constants/points';
import { usePanoramaField } from '../../hooks/usePanoramaField';
import type { Point } from '../../types';
import { mediaUrl } from '../../utils/mediaUrl';

interface PanoramaFieldProps {
  point: Point;
  onSaved: (point: Point) => void;
}

type PanoramaState = ReturnType<typeof usePanoramaField>;

const UPLOAD_CLASS =
  'inline-flex cursor-pointer items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60';
const BUTTON_CLASS =
  'rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50';

/** Pre-visualizacao em faixa larga; ao carregar, mede a imagem para os avisos de tamanho. */
function PanoramaPreview({ field }: { field: PanoramaState }) {
  const { panorama } = field;
  if (!panorama) return <p className="text-sm text-gray-500">{VR_MESSAGES.panoramaEmpty}</p>;
  return (
    <img
      src={mediaUrl(panorama.url)}
      alt={panorama.alt_text}
      className="aspect-[2/1] w-full rounded-lg object-cover"
      onLoad={(event) => {
        const image = event.currentTarget;
        field.measure(panorama.url, image.naturalWidth, image.naturalHeight);
      }}
    />
  );
}

function uploadLabel(field: PanoramaState): string {
  if (field.busy) return MEDIA_MESSAGES.uploading;
  return field.panorama ? VR_MESSAGES.panoramaReplace : VR_MESSAGES.panoramaUpload;
}

/** Botoes de enviar/trocar e remover; o tamanho maximo e conferido antes do envio. */
function PanoramaActions({ field }: { field: PanoramaState }) {
  function handleFile(input: HTMLInputElement) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (file.size > MEDIA_MAX_BYTES) {
      field.setError(MEDIA_MESSAGES.tooLarge);
      return;
    }
    void field.upload(file);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <label className={UPLOAD_CLASS}>
        {uploadLabel(field)}
        <input
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          disabled={field.busy}
          className="sr-only"
          onChange={(event) => {
            handleFile(event.target);
          }}
        />
      </label>
      {field.panorama ? (
        <button
          type="button"
          className={BUTTON_CLASS}
          disabled={field.busy}
          onClick={() => void field.remove()}
        >
          {VR_MESSAGES.panoramaRemove}
        </button>
      ) : null}
    </div>
  );
}

/** Envio do panorama 360° com pre-visualizacao e avisos de tamanho (nao bloqueiam). */
export function PanoramaField({ point, onSaved }: PanoramaFieldProps) {
  const field = usePanoramaField(point, onSaved);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">Panorama 360°</h3>
      <p className="text-sm text-gray-600">{VR_MESSAGES.panoramaHelp}</p>
      {field.error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {field.error}
        </p>
      ) : null}
      <PanoramaPreview field={field} />
      {field.warnings.length > 0 ? (
        <ul className="space-y-1 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
          {field.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
      <PanoramaActions field={field} />
    </div>
  );
}

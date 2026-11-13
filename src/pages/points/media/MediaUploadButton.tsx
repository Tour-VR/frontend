import { useRef } from 'react';
import { ACCEPTED_IMAGE_TYPES, MEDIA_MAX_BYTES, MEDIA_MESSAGES } from '../../../constants/media';

interface MediaUploadButtonProps {
  busy: boolean;
  uploading: boolean;
  limitReached: boolean;
  onFile: (file: File) => void;
  onError: (message: string) => void;
}

/** Botao de envio: valida o tamanho no cliente antes de mandar o arquivo. */
export function MediaUploadButton({
  busy,
  uploading,
  limitReached,
  onFile,
  onError,
}: MediaUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const disabled = busy || limitReached;

  function handleChange(files: FileList | null) {
    const file = files?.[0];
    if (inputRef.current) inputRef.current.value = '';
    if (!file) return;
    if (file.size > MEDIA_MAX_BYTES) {
      onError(MEDIA_MESSAGES.tooLarge);
      return;
    }
    onFile(file);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label
        className={`inline-flex cursor-pointer items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60`}
      >
        {uploading ? MEDIA_MESSAGES.uploading : MEDIA_MESSAGES.upload}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            handleChange(event.target.files);
          }}
        />
      </label>
      {limitReached ? (
        <span className="text-sm text-gray-500">{MEDIA_MESSAGES.limitReached}</span>
      ) : null}
    </div>
  );
}

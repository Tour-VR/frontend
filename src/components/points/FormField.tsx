import { useId } from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  maxLength?: number;
  multiline?: boolean;
  disabled?: boolean;
}

const INPUT_CLASS =
  'block w-full rounded-lg border px-3 py-2 sm:text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500';

/** Campo com rotulo, dica, contador opcional (x/max) e mensagem de erro. */
export function FormField({ label, value, onChange, error, hint, ...options }: FormFieldProps) {
  const id = useId();
  const { maxLength, multiline = false, disabled = false } = options;
  const describedBy = `${id}-hint ${id}-error`;
  const props = {
    id,
    value,
    disabled,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    className: `${INPUT_CLASS} ${error ? 'border-red-400' : 'border-gray-300'}`,
    onChange: (event: { target: { value: string } }) => {
      onChange(event.target.value);
    },
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {multiline ? <textarea rows={8} {...props} /> : <input type="text" {...props} />}
      <div className="mt-1 flex justify-between gap-4 text-xs text-gray-500">
        <span id={`${id}-hint`}>{hint}</span>
        {maxLength ? <span>{`${String(value.length)}/${String(maxLength)}`}</span> : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

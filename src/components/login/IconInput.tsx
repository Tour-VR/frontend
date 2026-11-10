import type { LucideIcon } from 'lucide-react';
import { useId } from 'react';

interface IconInputProps {
  label: string;
  icon: LucideIcon;
  type: 'email' | 'password' | 'text';
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

/** Campo de formulario com rotulo e icone a esquerda. */
export function IconInput({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
}: IconInputProps) {
  const inputId = useId();

  return (
    <div>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          className="block w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}

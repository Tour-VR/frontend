import { Plus } from 'lucide-react';
import { FormField } from '../../components/points/FormField';
import { FormCard } from '../../components/ui/FormCard';
import { type NewUserFields, useUserCreateForm } from '../../hooks/useUserCreateForm';

interface FieldConfig {
  name: keyof NewUserFields;
  label: string;
  type?: 'email' | 'password';
  hint?: string;
}

const FIELDS: FieldConfig[] = [
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'fullName', label: 'Nome completo' },
  { name: 'username', label: 'Username' },
  {
    name: 'password',
    label: 'Senha inicial',
    type: 'password',
    hint: 'Pelo menos 8 caracteres, com letra e número.',
  },
];

/** Botao "Novo usuario" que abre o formulario de cadastro. O usuario nasce com papel comum. */
export function UserCreateForm({ onCreated }: { onCreated: () => void }) {
  const form = useUserCreateForm(onCreated);

  return (
    <div className="mb-6 space-y-4">
      <button
        type="button"
        aria-expanded={form.open}
        onClick={form.toggle}
        className="shadow-button inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" />
        Novo usuário
      </button>
      {form.success ? (
        <p role="status" className="text-sm text-green-700">
          {form.success}
        </p>
      ) : null}
      {form.open ? (
        <div className="max-w-xl">
          <FormCard
            title="Novo usuário"
            submitLabel="Criar usuário"
            submitting={form.submitting}
            error={form.error}
            onSubmit={() => void form.submit()}
          >
            {FIELDS.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                type={field.type}
                hint={field.hint}
                value={form.fields[field.name]}
                onChange={(value) => {
                  form.setField(field.name, value);
                }}
                error={field.name === 'password' ? form.passwordError : undefined}
              />
            ))}
          </FormCard>
        </div>
      ) : null}
    </div>
  );
}

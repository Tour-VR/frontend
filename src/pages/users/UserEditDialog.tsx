import { FormField } from '../../components/points/FormField';
import { Dialog } from '../../components/ui/Dialog';
import { EDIT_USER_TITLE, OTHER_EMAIL_HINT, SELF_EMAIL_HINT } from '../../constants/users';
import { type EditUserFields, useUserEditForm } from '../../hooks/useUserEditForm';
import type { AdminUser } from '../../types';

interface UserEditDialogProps {
  user: AdminUser;
  isSelf: boolean;
  onClose: () => void;
  onSaved: (before: AdminUser, after: AdminUser) => void;
}

interface FieldConfig {
  name: keyof EditUserFields;
  label: string;
  type?: 'email';
}

const FIELDS: FieldConfig[] = [
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'fullName', label: 'Nome completo' },
  { name: 'username', label: 'Username' },
];

function DialogActions({ submitting, onCancel }: { submitting: boolean; onCancel: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="shadow-button rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  );
}

/** Janela de edicao dos dados basicos (e-mail, nome, username) de um usuario. */
export function UserEditDialog({ user, isSelf, onClose, onSaved }: UserEditDialogProps) {
  const form = useUserEditForm(user, onSaved);
  const emailHint = isSelf ? SELF_EMAIL_HINT : OTHER_EMAIL_HINT;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={EDIT_USER_TITLE}
      description={user.email}
    >
      <form
        noValidate
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.submit();
        }}
      >
        {FIELDS.map((field) => (
          <FormField
            key={field.name}
            label={field.label}
            type={field.type}
            hint={field.name === 'email' ? emailHint : undefined}
            value={form.fields[field.name]}
            onChange={(value) => {
              form.setField(field.name, value);
            }}
          />
        ))}
        {form.error ? (
          <p role="alert" className="text-sm text-red-600">
            {form.error}
          </p>
        ) : null}
        <DialogActions submitting={form.submitting} onCancel={onClose} />
      </form>
    </Dialog>
  );
}

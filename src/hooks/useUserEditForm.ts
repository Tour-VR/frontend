import { useState } from 'react';
import { updateUserAdmin } from '../services/users';
import type { AdminUser } from '../types';
import { apiErrorMessage } from '../utils/apiError';

export interface EditUserFields {
  email: string;
  fullName: string;
  username: string;
}

function fieldsOf(user: AdminUser): EditUserFields {
  return { email: user.email, fullName: user.full_name ?? '', username: user.username ?? '' };
}

/** Estado do formulario "Editar usuario". `onSaved` recebe o usuario antes e depois. */
export function useUserEditForm(
  user: AdminUser,
  onSaved: (before: AdminUser, after: AdminUser) => void,
) {
  const [fields, setFields] = useState<EditUserFields>(() => fieldsOf(user));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setField(name: keyof EditUserFields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const updated = await updateUserAdmin(user.id, {
        email: fields.email.trim(),
        full_name: fields.fullName.trim() || null,
        username: fields.username.trim() || null,
      });
      onSaved(user, updated);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return { fields, setField, error, submitting, submit };
}

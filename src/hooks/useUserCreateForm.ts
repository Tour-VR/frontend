import { useState } from 'react';
import { USER_CREATED_MESSAGE } from '../constants/users';
import { createUser } from '../services/users';
import { apiErrorMessage } from '../utils/apiError';
import { validatePassword } from '../utils/validatePassword';

export interface NewUserFields {
  email: string;
  fullName: string;
  username: string;
  password: string;
}

const EMPTY: NewUserFields = { email: '', fullName: '', username: '', password: '' };

/** Estado do formulario "Novo usuario". `onCreated` recarrega a lista. */
export function useUserCreateForm(onCreated: () => void) {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<NewUserFields>(EMPTY);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setField(name: keyof NewUserFields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  function toggle() {
    setOpen((current) => !current);
    setSuccess(null);
    setError(null);
  }

  async function submit() {
    const rule = validatePassword(fields.password) ?? undefined;
    setPasswordError(rule);
    setError(null);
    if (rule) return;

    setSubmitting(true);
    try {
      await createUser({
        email: fields.email,
        password: fields.password,
        full_name: fields.fullName || null,
        username: fields.username || null,
      });
      setFields(EMPTY);
      setOpen(false);
      setSuccess(USER_CREATED_MESSAGE);
      onCreated();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return { open, toggle, fields, setField, passwordError, error, success, submitting, submit };
}

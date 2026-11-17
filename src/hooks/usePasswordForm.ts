import { useState } from 'react';
import {
  CURRENT_PASSWORD_REQUIRED,
  PASSWORD_CHANGED_MESSAGE,
  PASSWORD_MISMATCH_MESSAGE,
} from '../constants/profile';
import { changeMyPassword } from '../services/profile';
import { apiErrorMessage, apiErrorStatus } from '../utils/apiError';
import { validatePassword } from '../utils/validatePassword';

const HTTP_BAD_REQUEST = 400;

export interface PasswordFields {
  current: string;
  next: string;
  confirm: string;
}

type PasswordErrors = Partial<Record<keyof PasswordFields, string>>;

const EMPTY: PasswordFields = { current: '', next: '', confirm: '' };

/** Mesma regra do backend, mais a confirmacao: so envia se nao houver erro. */
export function validatePasswordFields(fields: PasswordFields): PasswordErrors {
  const errors: PasswordErrors = {};
  if (!fields.current) errors.current = CURRENT_PASSWORD_REQUIRED;
  const rule = validatePassword(fields.next);
  if (rule) errors.next = rule;
  if (fields.confirm !== fields.next) errors.confirm = PASSWORD_MISMATCH_MESSAGE;
  return errors;
}

/** Estado do formulario de troca de senha. `400` do backend aparece no campo da senha atual. */
export function usePasswordForm() {
  const [fields, setFields] = useState<PasswordFields>(EMPTY);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  function setField(name: keyof PasswordFields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function submit() {
    setSuccess(null);
    const found = validatePasswordFields(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await changeMyPassword({ current_password: fields.current, new_password: fields.next });
      setFields(EMPTY);
      setSuccess(PASSWORD_CHANGED_MESSAGE);
    } catch (err) {
      const message = apiErrorMessage(err);
      setErrors(
        apiErrorStatus(err) === HTTP_BAD_REQUEST ? { current: message } : { next: message },
      );
    } finally {
      setSubmitting(false);
    }
  }

  return { fields, setField, errors, submitting, success, submit };
}

import { useState } from 'react';
import { PROFILE_SAVED_MESSAGE } from '../constants/profile';
import { useAuth } from '../contexts/AuthContext';
import { updateMe } from '../services/profile';
import { apiErrorMessage } from '../utils/apiError';

/** Estado do formulario de dados pessoais; ao salvar, atualiza a sessao via `updateUser`. */
export function useProfileForm() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateMe({ full_name: fullName, username });
      updateUser(updated);
      setSuccess(PROFILE_SAVED_MESSAGE);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return {
    email: user?.email ?? '',
    fullName,
    setFullName,
    username,
    setUsername,
    submitting,
    error,
    success,
    submit,
  };
}

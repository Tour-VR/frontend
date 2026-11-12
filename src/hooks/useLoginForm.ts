import type { AxiosError } from 'axios';
import type { SubmitEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { AuthResponse, LoginPayload } from '../types';

interface ApiErrorResponse {
  detail?: string;
}

const DEFAULT_ERROR_MESSAGE = 'Credenciais invalidas. Tente novamente.';

/** Estado e envio do formulario de login. */
export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, clearSessionNotice } = useAuth();
  const navigate = useNavigate();

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    clearSessionNotice();
    setError('');
    setIsLoading(true);

    try {
      const payload: LoginPayload = { email, password };

      const authResponse = await api.post<AuthResponse>('/auth/login', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await signIn(authResponse.data.access_token);
      void navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error(error);
      // `data` pode vir vazio (ex.: resposta sem corpo), por isso o tipo admite undefined.
      const backendMessage = (error as AxiosError<ApiErrorResponse | undefined>).response?.data
        ?.detail;
      setError(backendMessage || DEFAULT_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, error, isLoading, submit };
}

export type LoginFormState = ReturnType<typeof useLoginForm>;

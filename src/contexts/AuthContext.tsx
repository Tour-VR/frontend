import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { SESSION_EXPIRED_MESSAGE } from '../constants/messages';
import {
  api,
  clearAuthToken,
  getStoredToken,
  setAuthToken,
  setUnauthorizedHandler,
} from '../services/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  sessionNotice: string | null;
  clearSessionNotice: () => void;
  signIn: (token: string) => Promise<User>;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Registra o handler de 401 da API e guarda o aviso de sessao expirada. */
function useSessionExpiry(setUser: (user: User | null) => void) {
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

  // O cleanup e obrigatorio: o StrictMode monta os efeitos duas vezes em desenvolvimento.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setSessionNotice(SESSION_EXPIRED_MESSAGE);
    });
    return () => {
      setUnauthorizedHandler(null);
    };
  }, [setUser]);

  function clearSessionNotice() {
    setSessionNotice(null);
  }

  return { sessionNotice, clearSessionNotice };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function syncUserFromToken(token: string) {
    setAuthToken(token);

    try {
      const response = await api.get<User>('/users/me');
      setUser(response.data);
      return response.data;
    } catch (error) {
      clearAuthToken();
      setUser(null);
      throw error;
    }
  }

  // Chamado antes da restauracao de sessao: um 401 em GET /users/me na recarga ja encontra o handler.
  const { sessionNotice, clearSessionNotice } = useSessionExpiry(setUser);

  useEffect(() => {
    async function restoreSession() {
      const token = getStoredToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await syncUserFromToken(token);
      } catch (error) {
        console.error('Erro ao validar token salvo:', error);
      } finally {
        setLoading(false);
      }
    }

    void restoreSession();
  }, []);

  async function signIn(token: string) {
    return syncUserFromToken(token);
  }

  function signOut() {
    clearAuthToken();
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    sessionNotice,
    clearSessionNotice,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}

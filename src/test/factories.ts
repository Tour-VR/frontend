import type { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

type AuthValue = ReturnType<typeof useAuth>;

/** Usuario de exemplo para os testes. */
export function buildUser(overrides: Partial<User> = {}): User {
  return {
    email: 'ana@tourvr.test',
    full_name: 'Ana Souza',
    username: 'ana',
    role: 'admin',
    is_active: true,
    is_verified: false,
    created_at: null,
    updated_at: null,
    ...overrides,
  };
}

/** Valor de `useAuth()` para testes que mockam o AuthContext. */
export function buildAuthValue(overrides: Partial<AuthValue> = {}): AuthValue {
  return {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: false,
    sessionNotice: null,
    clearSessionNotice: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    ...overrides,
  };
}

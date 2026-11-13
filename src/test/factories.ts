import type { useAuth } from '../contexts/AuthContext';
import type { Point, User } from '../types';

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

/** Ponto de interesse de exemplo para os testes. */
export function buildPoint(overrides: Partial<Point> = {}): Point {
  return {
    id: '665f1c2e9b1e8a0012345678',
    slug: 'biblioteca-central',
    name: 'Biblioteca Central',
    summary: 'Onde ficam os livros.',
    history: 'Historia da biblioteca.',
    status: 'draft',
    media: [],
    created_at: '2026-11-10T12:00:00Z',
    updated_at: '2026-11-11T12:00:00Z',
    published_at: null,
    ...overrides,
  };
}

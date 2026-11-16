import type { useAuth } from '../contexts/AuthContext';
import type { AdminUser, MetricsOverview, Point, User } from '../types';

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
    updateUser: vi.fn(),
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

/** Usuario como aparece na gestao de usuarios. */
export function buildAdminUser(overrides: Partial<AdminUser> = {}): AdminUser {
  return {
    id: '665f1c2e9b1e8a0012340001',
    email: 'bruno@tourvr.test',
    username: 'bruno',
    full_name: 'Bruno Lima',
    role: 'user',
    is_active: true,
    created_at: '2026-11-10T12:00:00Z',
    ...overrides,
  };
}

/** Resposta de GET /admin/metrics/overview. */
export function buildMetrics(overrides: Partial<MetricsOverview> = {}): MetricsOverview {
  return {
    points_total: 7,
    points_published: 5,
    visits_total: 31,
    visits_last_7_days: 9,
    visits_by_mode: { ar: 22, vr: 13 },
    top_points: [{ slug: 'biblioteca-central', name: 'Biblioteca Central', visits: 17 }],
    ...overrides,
  };
}

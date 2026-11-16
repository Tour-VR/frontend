import { getMetricsOverview } from './metrics';
import { changeMyPassword, updateMe } from './profile';
import { createUser, listUsers, updateUserAdmin } from './users';

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn() }));
vi.mock('./api', () => ({ api }));

beforeEach(() => {
  for (const method of Object.values(api)) method.mockResolvedValue({ data: 'resposta' });
});

describe('servicos de metricas, usuarios e perfil', () => {
  it('getMetricsOverview chama GET /admin/metrics/overview', async () => {
    await expect(getMetricsOverview()).resolves.toBe('resposta');
    expect(api.get).toHaveBeenCalledWith('/admin/metrics/overview');
  });

  it('listUsers envia page e page_size', async () => {
    await expect(listUsers(2, 20)).resolves.toBe('resposta');
    expect(api.get).toHaveBeenCalledWith('/admin/users', { params: { page: 2, page_size: 20 } });
  });

  it('updateUserAdmin chama PATCH com o id', async () => {
    await updateUserAdmin('abc', { is_active: false });
    expect(api.patch).toHaveBeenCalledWith('/admin/users/abc', { is_active: false });
  });

  it('createUser usa POST /auth/register', async () => {
    const payload = { email: 'a@b.test', password: 'senha1234' };
    await createUser(payload);
    expect(api.post).toHaveBeenCalledWith('/auth/register', payload);
  });

  it('updateMe e changeMyPassword usam PUT em /users/me', async () => {
    await updateMe({ full_name: 'Ana' });
    await changeMyPassword({ current_password: 'a', new_password: 'b' });
    expect(api.put).toHaveBeenCalledWith('/users/me', { full_name: 'Ana' });
    expect(api.put).toHaveBeenCalledWith('/users/me/password', {
      current_password: 'a',
      new_password: 'b',
    });
  });
});

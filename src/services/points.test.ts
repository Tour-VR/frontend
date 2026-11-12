import {
  createPoint,
  deletePoint,
  getPoint,
  listPoints,
  publishPoint,
  unpublishPoint,
  updatePoint,
} from './points';
import { buildPoint } from '../test/factories';

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }));
vi.mock('./api', () => ({ api }));

const point = buildPoint();

beforeEach(() => {
  api.get.mockResolvedValue({ data: point });
  api.post.mockResolvedValue({ data: point });
  api.put.mockResolvedValue({ data: point });
  api.delete.mockResolvedValue({ data: undefined });
});

describe('services/points', () => {
  it('listPoints chama GET /admin/points com o filtro', async () => {
    api.get.mockResolvedValue({ data: [point] });
    await expect(listPoints('draft')).resolves.toEqual([point]);
    expect(api.get).toHaveBeenCalledWith('/admin/points', { params: { status: 'draft' } });
  });

  it('getPoint chama GET /admin/points/:id', async () => {
    await expect(getPoint('abc')).resolves.toEqual(point);
    expect(api.get).toHaveBeenCalledWith('/admin/points/abc');
  });

  it('createPoint chama POST /admin/points', async () => {
    const payload = { slug: 's-1', name: 'Nome', summary: 'R', history: 'H' };
    await createPoint(payload);
    expect(api.post).toHaveBeenCalledWith('/admin/points', payload);
  });

  it('updatePoint chama PUT /admin/points/:id', async () => {
    await updatePoint('abc', { name: 'Novo' });
    expect(api.put).toHaveBeenCalledWith('/admin/points/abc', { name: 'Novo' });
  });

  it('deletePoint chama DELETE /admin/points/:id', async () => {
    await deletePoint('abc');
    expect(api.delete).toHaveBeenCalledWith('/admin/points/abc');
  });

  it('publishPoint e unpublishPoint chamam as rotas de publicacao', async () => {
    await publishPoint('abc');
    await unpublishPoint('abc');
    expect(api.post).toHaveBeenCalledWith('/admin/points/abc/publish');
    expect(api.post).toHaveBeenCalledWith('/admin/points/abc/unpublish');
  });
});

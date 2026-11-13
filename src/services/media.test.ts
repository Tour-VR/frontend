import { uploadMedia } from './media';

const api = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock('./api', () => ({ api }));

describe('uploadMedia', () => {
  it('envia o arquivo no campo file e devolve a resposta', async () => {
    const response = { url: '/media/a.jpg', content_type: 'image/jpeg', size_bytes: 3 };
    api.post.mockResolvedValue({ data: response });
    const file = new File(['abc'], 'foto.jpg', { type: 'image/jpeg' });

    await expect(uploadMedia(file)).resolves.toEqual(response);

    const [path, body] = api.post.mock.calls[0] as [string, FormData];
    expect(path).toBe('/admin/media');
    expect(body.get('file')).toBe(file);
  });
});

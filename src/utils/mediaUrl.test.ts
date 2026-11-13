import { API_BASE_URL } from '../services/api';
import { mediaUrl } from './mediaUrl';

describe('mediaUrl', () => {
  it('prefixa a URL relativa com o endereco da API', () => {
    expect(mediaUrl('/media/abc.jpg')).toBe(`${API_BASE_URL.replace(/\/$/, '')}/media/abc.jpg`);
  });

  it('mantem a URL absoluta intocada', () => {
    expect(mediaUrl('https://exemplo.com/foto.jpg')).toBe('https://exemplo.com/foto.jpg');
  });
});

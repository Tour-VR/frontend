import { VISITOR_APP_URL } from '../constants/qr';
import { visitorPointUrl } from './visitorUrl';

describe('visitorPointUrl', () => {
  it('remove barras finais da base', () => {
    expect(visitorPointUrl('biblioteca', 'https://tour.exemplo.br//')).toBe(
      'https://tour.exemplo.br/p/biblioteca',
    );
  });

  it('codifica o slug', () => {
    expect(visitorPointUrl('a b/c', 'http://x')).toBe('http://x/p/a%20b%2Fc');
  });

  it('usa a base configurada quando nenhuma e informada', () => {
    expect(visitorPointUrl('biblioteca')).toBe(`${VISITOR_APP_URL}/p/biblioteca`);
  });
});

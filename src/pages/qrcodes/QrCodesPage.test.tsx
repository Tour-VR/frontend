import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QRCode from 'qrcode';
import { MemoryRouter } from 'react-router-dom';
import { listPoints } from '../../services/points';
import { buildPoint } from '../../test/factories';
import { EMPTY_QR_MESSAGE, QrCodesPage } from './QrCodesPage';

vi.mock('../../services/points');
vi.mock('qrcode');

const DATA_URL = 'data:image/png;base64,QR';
// toDataURL tem sobrecarga com callback; aqui so interessa a forma que devolve Promise.
const toDataUrl = vi.mocked(QRCode.toDataURL as (text: string) => Promise<string>);
const BIBLIOTECA = buildPoint({ status: 'published' });
const REITORIA = buildPoint({
  id: '665f1c2e9b1e8a0012345679',
  slug: 'reitoria',
  name: 'Reitoria',
  status: 'published',
});

function renderPage(path = '/qrcodes') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <QrCodesPage />
    </MemoryRouter>,
  );
}

describe('QrCodesPage', () => {
  beforeEach(() => {
    toDataUrl.mockResolvedValue(DATA_URL);
  });

  it('mostra carregando e busca so os publicados', async () => {
    vi.mocked(listPoints).mockResolvedValue([]);
    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Carregando');
    expect(await screen.findByText(EMPTY_QR_MESSAGE)).toBeInTheDocument();
    expect(listPoints).toHaveBeenCalledWith('published');
  });

  it('mostra um cartao por ponto com QR, URL e download', async () => {
    vi.mocked(listPoints).mockResolvedValue([BIBLIOTECA, REITORIA]);
    renderPage();

    expect(await screen.findAllByRole('article')).toHaveLength(2);
    const img = await screen.findByRole('img', { name: 'QR Code de Biblioteca Central' });
    expect(img).toHaveAttribute('src', DATA_URL);
    expect(screen.getByText(/\/p\/biblioteca-central$/)).toBeInTheDocument();
    expect(screen.getAllByText('Aponte a câmera do celular')).toHaveLength(2);
    const links = await screen.findAllByRole('link', { name: 'Baixar PNG' });
    expect(links[0]).toHaveAttribute('download', 'qr-biblioteca-central.png');
  });

  it('?slug= mostra so aquele ponto', async () => {
    vi.mocked(listPoints).mockResolvedValue([BIBLIOTECA, REITORIA]);
    renderPage('/qrcodes?slug=reitoria');

    expect(await screen.findAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Reitoria' })).toBeInTheDocument();
  });

  it('erro na geracao do QR aparece no cartao', async () => {
    vi.mocked(listPoints).mockResolvedValue([BIBLIOTECA]);
    toDataUrl.mockRejectedValue(new Error('falha'));
    renderPage();

    expect(await screen.findByText('Não foi possível gerar o QR Code.')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Baixar PNG' })).not.toBeInTheDocument();
  });

  it('erro da API mostra Tentar novamente', async () => {
    vi.mocked(listPoints).mockRejectedValueOnce(new Error('falha')).mockResolvedValue([]);
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByText(EMPTY_QR_MESSAGE)).toBeInTheDocument();
  });

  it('Imprimir chama window.print', async () => {
    vi.mocked(listPoints).mockResolvedValue([]);
    const print = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Imprimir' }));
    expect(print).toHaveBeenCalledOnce();
  });
});

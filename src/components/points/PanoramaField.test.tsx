import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MEDIA_MAX_BYTES, MEDIA_MESSAGES } from '../../constants/media';
import { VR_MESSAGES } from '../../constants/points';
import { uploadMedia } from '../../services/media';
import { updatePoint } from '../../services/points';
import { buildPoint } from '../../test/factories';
import type { MediaItem, Point } from '../../types';
import { PanoramaField } from './PanoramaField';

vi.mock('../../services/points');
vi.mock('../../services/media');

const PHOTO: MediaItem = {
  id: 'f',
  kind: 'photo',
  url: '/media/f.jpg',
  caption: null,
  alt_text: 'F',
};
const OLD: MediaItem = {
  id: 'p',
  kind: 'panorama',
  url: '/media/antigo.jpg',
  caption: null,
  alt_text: 'Panorama 360°',
};

function setup(point: Point) {
  const onSaved = vi.fn();
  vi.mocked(updatePoint).mockImplementation((_id, payload) =>
    Promise.resolve(
      buildPoint({
        media: (payload.media ?? []).map((item, i) => ({
          ...item,
          id: item.id ?? `novo-${String(i)}`,
        })),
      }),
    ),
  );
  const view = render(<PanoramaField point={point} onSaved={onSaved} />);
  return { ...view, onSaved };
}

function loadImage(width: number, height: number) {
  const image = screen.getByRole('img');
  Object.defineProperty(image, 'naturalWidth', { value: width });
  Object.defineProperty(image, 'naturalHeight', { value: height });
  fireEvent.load(image);
}

describe('PanoramaField', () => {
  it('substitui o panorama anterior e mantem as fotos', async () => {
    vi.mocked(uploadMedia).mockResolvedValue({
      url: '/media/novo.jpg',
      content_type: 'image/jpeg',
      size_bytes: 10,
    });
    const { onSaved } = setup(buildPoint({ media: [PHOTO, OLD] }));

    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('antigo.jpg'));
    await userEvent.upload(
      screen.getByLabelText(VR_MESSAGES.panoramaReplace),
      new File(['x'], 'p.jpg', { type: 'image/jpeg' }),
    );

    expect(updatePoint).toHaveBeenCalledWith(buildPoint().id, {
      media: [
        PHOTO,
        {
          kind: 'panorama',
          url: '/media/novo.jpg',
          caption: null,
          alt_text: VR_MESSAGES.panoramaAltText,
        },
      ],
    });
    expect(onSaved).toHaveBeenCalledOnce();
  });

  it('mostra avisos de tamanho sem bloquear', () => {
    setup(buildPoint({ media: [OLD] }));

    loadImage(3000, 4000);

    expect(screen.getByText(VR_MESSAGES.aspectWarning)).toBeInTheDocument();
    expect(screen.getByLabelText(VR_MESSAGES.panoramaReplace)).toBeEnabled();
  });

  it('panorama no tamanho recomendado nao mostra aviso', () => {
    setup(buildPoint({ media: [OLD] }));

    loadImage(4096, 2048);

    expect(screen.queryByText(VR_MESSAGES.aspectWarning)).not.toBeInTheDocument();
  });

  it('sem panorama mostra o texto de ajuda e o envio', () => {
    setup(buildPoint({ media: [PHOTO] }));

    expect(screen.getByText(VR_MESSAGES.panoramaEmpty)).toBeInTheDocument();
    expect(screen.getByText(VR_MESSAGES.panoramaHelp)).toBeInTheDocument();
    expect(screen.getByLabelText(VR_MESSAGES.panoramaUpload)).toBeInTheDocument();
  });

  it('remove o panorama e mantem as fotos', async () => {
    setup(buildPoint({ media: [PHOTO, OLD] }));

    await userEvent.click(screen.getByRole('button', { name: VR_MESSAGES.panoramaRemove }));

    expect(updatePoint).toHaveBeenCalledWith(buildPoint().id, { media: [PHOTO] });
  });

  it('recusa arquivo maior que o limite antes de enviar', async () => {
    setup(buildPoint());
    const big = new File(['x'], 'grande.jpg', { type: 'image/jpeg' });
    Object.defineProperty(big, 'size', { value: MEDIA_MAX_BYTES + 1 });

    await userEvent.upload(screen.getByLabelText(VR_MESSAGES.panoramaUpload), big);

    expect(screen.getByRole('alert')).toHaveTextContent(MEDIA_MESSAGES.tooLarge);
    expect(uploadMedia).not.toHaveBeenCalled();
  });

  it('mostra erro quando o envio falha', async () => {
    vi.mocked(uploadMedia).mockRejectedValue(new Error('rede'));
    setup(buildPoint());

    await userEvent.upload(
      screen.getByLabelText(VR_MESSAGES.panoramaUpload),
      new File(['x'], 'p.jpg', { type: 'image/jpeg' }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível concluir');
  });

  it('mostra erro quando a gravacao falha', async () => {
    setup(buildPoint({ media: [OLD] }));
    vi.mocked(updatePoint).mockRejectedValue(new Error('rede'));

    await userEvent.click(screen.getByRole('button', { name: VR_MESSAGES.panoramaRemove }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível concluir');
  });
});

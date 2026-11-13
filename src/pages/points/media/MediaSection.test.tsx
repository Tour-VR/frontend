import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ALT_TEXT_PLACEHOLDER, MEDIA_MAX_BYTES } from '../../../constants/media';
import { uploadMedia } from '../../../services/media';
import { updatePoint } from '../../../services/points';
import { buildPoint } from '../../../test/factories';
import type { MediaItem } from '../../../types';
import { MediaSection } from './MediaSection';

vi.mock('../../../services/points');
vi.mock('../../../services/media');

function photo(index: number, altText = `Foto ${String(index)}`): MediaItem {
  return {
    id: `m${String(index)}`,
    kind: 'photo',
    url: `/media/${String(index)}.jpg`,
    caption: null,
    alt_text: altText,
  };
}

function renderSection(media: MediaItem[] = []) {
  const onSaved = vi.fn();
  render(<MediaSection point={buildPoint({ media })} onSaved={onSaved} />);
  return { onSaved, fileInput: () => screen.getByLabelText<HTMLInputElement>('Enviar foto') };
}

describe('MediaSection', () => {
  it('recusa no cliente arquivo maior que 20 MB', async () => {
    const { fileInput } = renderSection();
    const big = new File(['x'], 'grande.jpg', { type: 'image/jpeg' });
    Object.defineProperty(big, 'size', { value: MEDIA_MAX_BYTES + 1 });

    await userEvent.upload(fileInput(), big);

    expect(await screen.findByRole('alert')).toHaveTextContent('Arquivo maior que 20 MB.');
    expect(uploadMedia).not.toHaveBeenCalled();
  });

  it('envia a foto e exibe a miniatura com aviso de texto alternativo', async () => {
    let finishUpload: (value: Awaited<ReturnType<typeof uploadMedia>>) => void = () => undefined;
    vi.mocked(uploadMedia).mockReturnValue(
      new Promise((resolve) => {
        finishUpload = resolve;
      }),
    );
    vi.mocked(updatePoint).mockResolvedValue(
      buildPoint({ media: [{ ...photo(1), alt_text: ALT_TEXT_PLACEHOLDER }] }),
    );
    const { fileInput, onSaved } = renderSection();

    await userEvent.upload(fileInput(), new File(['x'], 'foto.jpg', { type: 'image/jpeg' }));
    expect(screen.getByText('Enviando...')).toBeInTheDocument();
    finishUpload({ url: '/media/1.jpg', content_type: 'image/jpeg', size_bytes: 1 });

    const image = await screen.findByRole('img', { name: ALT_TEXT_PLACEHOLDER });
    expect(image.getAttribute('src')).toMatch(/\/media\/1\.jpg$/);
    expect(screen.getByText('Preencha o texto alternativo')).toBeInTheDocument();
    expect(screen.getByLabelText('Texto alternativo')).toHaveValue('');
    expect(onSaved).toHaveBeenCalledOnce();
  });

  it('salva o texto alternativo ao sair do campo', async () => {
    vi.mocked(updatePoint).mockResolvedValue(buildPoint({ media: [photo(1, 'Fachada')] }));
    renderSection([photo(1, ALT_TEXT_PLACEHOLDER)]);

    await userEvent.type(screen.getByLabelText('Texto alternativo'), 'Fachada');
    await userEvent.tab();

    await waitFor(() => {
      expect(updatePoint).toHaveBeenCalledWith(buildPoint().id, {
        media: [
          { id: 'm1', kind: 'photo', url: '/media/1.jpg', caption: null, alt_text: 'Fachada' },
        ],
      });
    });
    expect(screen.queryByText('Preencha o texto alternativo')).not.toBeInTheDocument();
  });

  it('sair do campo sem mudar nada nao grava', async () => {
    renderSection([photo(1)]);

    await userEvent.click(screen.getByLabelText('Legenda'));
    await userEvent.tab();

    expect(updatePoint).not.toHaveBeenCalled();
  });

  it('desabilita os botoes de ordem nas pontas', () => {
    renderSection([photo(1), photo(2)]);

    const up = screen.getAllByRole('button', { name: 'Mover para cima' });
    const down = screen.getAllByRole('button', { name: 'Mover para baixo' });
    expect(up[0]).toBeDisabled();
    expect(down[1]).toBeDisabled();
    expect(up[1]).toBeEnabled();
  });

  it('remove e reordena gravando a lista', async () => {
    vi.mocked(updatePoint).mockResolvedValue(buildPoint({ media: [photo(2)] }));
    renderSection([photo(1), photo(2)]);

    await userEvent.click(screen.getAllByRole('button', { name: 'Mover para baixo' })[0]);
    await userEvent.click(screen.getAllByRole('button', { name: 'Remover' })[0]);

    expect(updatePoint).toHaveBeenCalledTimes(2);
  });

  it('com 20 fotos desabilita o envio e mostra o limite', () => {
    renderSection(Array.from({ length: 20 }, (_, i) => photo(i)));

    expect(screen.getByLabelText('Enviar foto')).toBeDisabled();
    expect(screen.getByText('Limite de 20 fotos')).toBeInTheDocument();
  });

  it('sem fotos mostra a mensagem de lista vazia', () => {
    renderSection();

    expect(screen.getByText('Nenhuma foto enviada ainda.')).toBeInTheDocument();
  });
});

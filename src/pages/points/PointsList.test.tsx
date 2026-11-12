import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { deletePoint, listPoints, publishPoint, unpublishPoint } from '../../services/points';
import { buildPoint } from '../../test/factories';
import { PointsList } from './PointsList';

vi.mock('../../services/points');

function renderList() {
  return render(
    <MemoryRouter>
      <PointsList />
    </MemoryRouter>,
  );
}

async function openActions(name: string) {
  await userEvent.click(await screen.findByRole('button', { name: `Ações do ponto ${name}` }));
}

describe('PointsList', () => {
  it('mostra carregando e depois a lista com selo e data', async () => {
    vi.mocked(listPoints).mockResolvedValue([buildPoint()]);
    renderList();

    expect(screen.getByRole('status')).toHaveTextContent('Carregando');
    expect(await screen.findByRole('link', { name: 'Biblioteca Central' })).toHaveAttribute(
      'href',
      '/pontos/665f1c2e9b1e8a0012345678',
    );
    expect(screen.getByText('Rascunho')).toBeInTheDocument();
    expect(screen.getByText('11/11/2026')).toBeInTheDocument();
  });

  it('mostra o estado vazio com o botao Novo ponto', async () => {
    vi.mocked(listPoints).mockResolvedValue([]);
    renderList();

    expect(await screen.findByText('Nenhum ponto cadastrado ainda.')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Novo ponto' })).toHaveLength(2);
  });

  it('mostra erro e tenta novamente', async () => {
    vi.mocked(listPoints).mockRejectedValueOnce(new Error('falha')).mockResolvedValue([]);
    renderList();

    await userEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByText('Nenhum ponto cadastrado ainda.')).toBeInTheDocument();
  });

  it('o filtro muda o parametro da busca', async () => {
    vi.mocked(listPoints).mockResolvedValue([]);
    renderList();
    await screen.findByText('Nenhum ponto cadastrado ainda.');

    await userEvent.click(screen.getByRole('button', { name: 'Publicados' }));

    await waitFor(() => {
      expect(listPoints).toHaveBeenLastCalledWith('published');
    });
    expect(await screen.findByText('Nenhum ponto com este status.')).toBeInTheDocument();
  });

  it('publicar chama o servico e recarrega', async () => {
    vi.mocked(listPoints).mockResolvedValue([buildPoint()]);
    vi.mocked(publishPoint).mockResolvedValue(buildPoint({ status: 'published' }));
    renderList();

    await openActions('Biblioteca Central');
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Publicar' }));

    expect(publishPoint).toHaveBeenCalledWith('665f1c2e9b1e8a0012345678');
    await waitFor(() => {
      expect(listPoints).toHaveBeenCalledTimes(2);
    });
  });

  it('despublicar ponto publicado e mostrar erro da acao', async () => {
    vi.mocked(listPoints).mockResolvedValue([buildPoint({ status: 'published' })]);
    vi.mocked(unpublishPoint).mockRejectedValue(new Error('falha'));
    renderList();

    await openActions('Biblioteca Central');
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Despublicar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível concluir');
  });

  it('excluir pede confirmacao e so exclui se confirmado', async () => {
    vi.mocked(listPoints).mockResolvedValue([buildPoint()]);
    vi.mocked(deletePoint).mockResolvedValue();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValue(true);
    renderList();

    await openActions('Biblioteca Central');
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Excluir' }));
    expect(deletePoint).not.toHaveBeenCalled();

    await openActions('Biblioteca Central');
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Excluir' }));
    expect(confirm).toHaveBeenLastCalledWith(expect.stringContaining('Biblioteca Central'));
    expect(deletePoint).toHaveBeenCalledWith('665f1c2e9b1e8a0012345678');
  });
});

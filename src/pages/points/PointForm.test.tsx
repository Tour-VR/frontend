import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, type AxiosResponse } from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  createPoint,
  deletePoint,
  getPoint,
  publishPoint,
  updatePoint,
} from '../../services/points';
import { buildPoint } from '../../test/factories';
import { PointForm } from './PointForm';

vi.mock('../../services/points');

const ID = '665f1c2e9b1e8a0012345678';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/pontos" element={<p>lista de pontos</p>} />
        <Route path="/pontos/novo" element={<PointForm />} />
        <Route path="/pontos/:pointId" element={<PointForm />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillNew(name: string) {
  await userEvent.type(screen.getByLabelText('Nome'), name);
  await userEvent.type(screen.getByLabelText('Resumo'), 'Resumo');
  await userEvent.type(screen.getByLabelText('História'), 'Historia');
}

describe('PointForm — criacao', () => {
  it('sugere o slug a partir do nome e cria o ponto', async () => {
    vi.mocked(createPoint).mockResolvedValue(buildPoint());
    vi.mocked(getPoint).mockResolvedValue(buildPoint());
    renderAt('/pontos/novo');

    await fillNew('Praça da Informação');
    expect(screen.getByLabelText('Identificador')).toHaveValue('praca-da-informacao');
    expect(screen.getByText('6/280')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(createPoint).toHaveBeenCalledWith({
      name: 'Praça da Informação',
      slug: 'praca-da-informacao',
      summary: 'Resumo',
      history: 'Historia',
    });
    expect(await screen.findByText('Ponto criado.')).toBeInTheDocument();
  });

  it('erro de validacao impede o envio', async () => {
    renderAt('/pontos/novo');

    await userEvent.type(screen.getByLabelText('Nome'), 'ab');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText('O nome precisa ter entre 3 e 120 caracteres.')).toBeInTheDocument();
    expect(createPoint).not.toHaveBeenCalled();
  });

  it('409 aparece no campo slug e mantem o que foi digitado', async () => {
    vi.mocked(createPoint).mockRejectedValue(
      new AxiosError('conflito', 'ERR', undefined, undefined, {
        status: 409,
        data: { detail: 'Ja existe um ponto com este slug.' },
      } as AxiosResponse),
    );
    renderAt('/pontos/novo');

    await fillNew('Biblioteca Central');
    await userEvent.clear(screen.getByLabelText('Identificador'));
    await userEvent.type(screen.getByLabelText('Identificador'), 'biblio');
    await userEvent.type(screen.getByLabelText('Nome'), ' Nova');
    expect(screen.getByLabelText('Identificador')).toHaveValue('biblio');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(
      await screen.findByText('Já existe um ponto com este identificador.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toHaveValue('Biblioteca Central Nova');
  });

  it('outro erro da API aparece como mensagem geral', async () => {
    vi.mocked(createPoint).mockRejectedValue(new Error('rede'));
    renderAt('/pontos/novo');

    await fillNew('Biblioteca');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível concluir');
  });
});

describe('PointForm — edicao', () => {
  it('mostra carregando e depois os dados; salva sem media', async () => {
    vi.mocked(getPoint).mockResolvedValue(buildPoint());
    vi.mocked(updatePoint).mockResolvedValue(buildPoint({ name: 'Biblioteca Nova' }));
    renderAt(`/pontos/${ID}`);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando');
    expect(await screen.findByLabelText('Nome')).toHaveValue('Biblioteca Central');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(updatePoint).toHaveBeenCalledWith(ID, {
      name: 'Biblioteca Central',
      slug: 'biblioteca-central',
      summary: 'Onde ficam os livros.',
      history: 'Historia da biblioteca.',
    });
    expect(await screen.findByText('Alterações salvas.')).toBeInTheDocument();
  });

  it('slug bloqueado se publicado; publicar atualiza o selo', async () => {
    vi.mocked(getPoint).mockResolvedValue(buildPoint());
    vi.mocked(publishPoint).mockResolvedValue(buildPoint({ status: 'published' }));
    renderAt(`/pontos/${ID}`);

    expect(await screen.findByLabelText('Identificador')).toBeEnabled();
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }));

    expect(await screen.findByText('Publicado')).toBeInTheDocument();
    expect(screen.getByLabelText('Identificador')).toBeDisabled();
    expect(screen.getByText('Despublique para alterar o identificador.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Despublicar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'QR Code' })).toHaveAttribute(
      'href',
      '/qrcodes?slug=biblioteca-central',
    );
  });

  it('excluir pede confirmacao e volta para a lista', async () => {
    vi.mocked(getPoint).mockResolvedValue(buildPoint());
    vi.mocked(deletePoint).mockResolvedValue();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderAt(`/pontos/${ID}`);

    await userEvent.click(await screen.findByRole('button', { name: 'Excluir' }));

    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('Biblioteca Central'));
    expect(deletePoint).toHaveBeenCalledWith(ID);
    expect(await screen.findByText('lista de pontos')).toBeInTheDocument();
  });

  it('ponto inexistente mostra erro', async () => {
    vi.mocked(getPoint).mockRejectedValue(new Error('404'));
    renderAt(`/pontos/${ID}`);

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível concluir');
  });
});

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, type AxiosResponse } from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { createUser, listUsers, updateUserAdmin } from '../../services/users';
import { buildAdminUser, buildAuthValue, buildUser } from '../../test/factories';
import type { AdminUser } from '../../types';
import { UsersPage } from './UsersPage';

vi.mock('../../contexts/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../../services/users');

const self = buildAdminUser({
  id: '665f1c2e9b1e8a0012340000',
  email: 'ana@tourvr.test',
  full_name: 'Ana Souza',
  role: 'admin',
});
const other = buildAdminUser();

function page(items: AdminUser[], total = items.length, pageNumber = 1) {
  return { items, total, page: pageNumber, page_size: 20 };
}

function renderPage() {
  vi.mocked(useAuth).mockReturnValue(
    buildAuthValue({ user: buildUser(), isAuthenticated: true, isAdmin: true }),
  );
  return render(<UsersPage />);
}

async function rowOf(email: string) {
  const cell = await screen.findByText(email);
  return cell.closest('tr')!;
}

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listUsers).mockResolvedValue(page([self, other]));
    vi.mocked(updateUserAdmin).mockResolvedValue(other);
  });

  it('lista usuarios com papel e situacao', async () => {
    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Carregando');
    const row = await rowOf('bruno@tourvr.test');
    expect(within(row).getByText('Bruno Lima')).toBeInTheDocument();
    expect(within(row).getByRole('combobox')).toHaveValue('user');
    expect(within(row).getByText('Ativo')).toBeInTheDocument();
    expect(screen.getByText('Página 1 de 1')).toBeInTheDocument();
    expect(listUsers).toHaveBeenCalledWith(1, 20);
  });

  it('linha do proprio usuario fica desabilitada com a dica Voce', async () => {
    renderPage();

    const row = await rowOf('ana@tourvr.test');
    expect(within(row).getByText('Você')).toBeInTheDocument();
    expect(within(row).getByRole('combobox')).toBeDisabled();
    expect(within(row).getByRole('button', { name: 'Desativar' })).toBeDisabled();
  });

  it('paginacao muda a pagina', async () => {
    vi.mocked(listUsers).mockResolvedValue(page([other], 45));
    renderPage();

    await screen.findByText('Página 1 de 3');
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Próxima' }));

    expect(await screen.findByText('Página 2 de 3')).toBeInTheDocument();
    expect(listUsers).toHaveBeenLastCalledWith(2, 20);
    await userEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(listUsers).toHaveBeenLastCalledWith(1, 20);
  });

  it('desativar chama o servico e recarrega; inativo mostra Reativar', async () => {
    renderPage();

    const row = await rowOf('bruno@tourvr.test');
    vi.mocked(listUsers).mockResolvedValue(page([self, { ...other, is_active: false }]));
    await userEvent.click(within(row).getByRole('button', { name: 'Desativar' }));

    expect(updateUserAdmin).toHaveBeenCalledWith(other.id, { is_active: false });
    const updated = await rowOf('bruno@tourvr.test');
    expect(await within(updated).findByText('Inativo')).toBeInTheDocument();
    expect(within(updated).getByRole('button', { name: 'Reativar' })).toBeInTheDocument();
  });

  it('mudar papel pede confirmacao', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValue(true);
    renderPage();
    const select = within(await rowOf('bruno@tourvr.test')).getByRole('combobox');

    await userEvent.selectOptions(select, 'admin');
    expect(updateUserAdmin).not.toHaveBeenCalled();
    await userEvent.selectOptions(select, 'admin');

    expect(confirm).toHaveBeenCalledWith(
      'Alterar o papel de bruno@tourvr.test? A mudança vale no próximo login.',
    );
    expect(updateUserAdmin).toHaveBeenCalledWith(other.id, { role: 'admin' });
  });

  it('erro da acao aparece em alerta', async () => {
    vi.mocked(updateUserAdmin).mockRejectedValue(
      new AxiosError('erro', 'ERR', undefined, undefined, {
        status: 400,
        data: { detail: 'Você não pode remover o próprio acesso de administrador.' },
      } as AxiosResponse),
    );
    renderPage();

    const row = await rowOf('bruno@tourvr.test');
    await userEvent.click(within(row).getByRole('button', { name: 'Desativar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('próprio acesso');
  });

  it('erro ao listar permite tentar novamente', async () => {
    vi.mocked(listUsers).mockRejectedValueOnce(new Error('falha'));
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('bruno@tourvr.test')).toBeInTheDocument();
  });

  it('criar usuario valida a senha, cria e recarrega a lista', async () => {
    vi.mocked(createUser).mockResolvedValue(buildUser({ email: 'novo@tourvr.test' }));
    renderPage();
    await rowOf('bruno@tourvr.test');

    await userEvent.click(screen.getByRole('button', { name: 'Novo usuário' }));
    await userEvent.type(screen.getByLabelText('E-mail'), 'novo@tourvr.test');
    await userEvent.type(screen.getByLabelText('Nome completo'), 'Novo Colega');
    await userEvent.type(screen.getByLabelText('Senha inicial'), 'curta');
    await userEvent.click(screen.getByRole('button', { name: 'Criar usuário' }));
    expect(screen.getByText(/pelo menos 8 caracteres e incluir/)).toBeInTheDocument();
    expect(createUser).not.toHaveBeenCalled();

    await userEvent.type(screen.getByLabelText('Senha inicial'), '1234');
    await userEvent.click(screen.getByRole('button', { name: 'Criar usuário' }));

    expect(
      await screen.findByText('Usuário criado. Informe a senha inicial à pessoa.'),
    ).toBeInTheDocument();
    expect(createUser).toHaveBeenCalledWith({
      email: 'novo@tourvr.test',
      password: 'curta1234',
      full_name: 'Novo Colega',
      username: null,
    });
    expect(listUsers).toHaveBeenCalledTimes(2);
    expect(screen.queryByLabelText('Senha inicial')).not.toBeInTheDocument();
  });

  it('erro ao criar usuario aparece no formulario', async () => {
    vi.mocked(createUser).mockRejectedValue(
      new AxiosError('erro', 'ERR', undefined, undefined, {
        status: 400,
        data: { detail: 'Ja existe um usuario com este email.' },
      } as AxiosResponse),
    );
    renderPage();
    await rowOf('bruno@tourvr.test');

    await userEvent.click(screen.getByRole('button', { name: 'Novo usuário' }));
    await userEvent.type(screen.getByLabelText('E-mail'), 'bruno@tourvr.test');
    await userEvent.type(screen.getByLabelText('Username'), 'bruno');
    await userEvent.type(screen.getByLabelText('Senha inicial'), 'senha1234');
    await userEvent.click(screen.getByRole('button', { name: 'Criar usuário' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Ja existe um usuario');
  });
});

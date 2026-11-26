import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, type AxiosResponse } from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { listUsers, updateUserAdmin } from '../../services/users';
import { buildAdminUser, buildAuthValue, buildUser } from '../../test/factories';
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
const signOut = vi.fn();

function renderPage() {
  vi.mocked(useAuth).mockReturnValue(
    buildAuthValue({ user: buildUser(), isAuthenticated: true, isAdmin: true, signOut }),
  );
  return render(<UsersPage />);
}

async function openEditFor(email: string) {
  await screen.findByText(email);
  await userEvent.click(screen.getByRole('button', { name: `Editar ${email}` }));
  return screen.findByRole('dialog');
}

describe('UsersPage — editar usuario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listUsers).mockResolvedValue({
      items: [self, other],
      total: 2,
      page: 1,
      page_size: 20,
    });
  });

  it('edita e-mail, nome e username de outro usuario e recarrega a lista', async () => {
    vi.mocked(updateUserAdmin).mockResolvedValue({ ...other, email: 'bruno.lima@tourvr.test' });
    renderPage();

    const dialog = await openEditFor('bruno@tourvr.test');
    expect(within(dialog).getByText('A pessoa passa a entrar com o novo e-mail.')).toBeVisible();
    const email = within(dialog).getByLabelText('E-mail');
    await userEvent.clear(email);
    await userEvent.type(email, ' bruno.lima@tourvr.test ');
    await userEvent.clear(within(dialog).getByLabelText('Username'));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Dados do usuário atualizados.')).toBeInTheDocument();
    expect(updateUserAdmin).toHaveBeenCalledWith(other.id, {
      email: 'bruno.lima@tourvr.test',
      full_name: 'Bruno Lima',
      username: null,
    });
    expect(listUsers).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(signOut).not.toHaveBeenCalled();
  });

  it('erro do backend aparece na janela, que continua aberta', async () => {
    vi.mocked(updateUserAdmin).mockRejectedValue(
      new AxiosError('erro', 'ERR', undefined, undefined, {
        status: 400,
        data: { detail: 'Ja existe um usuario com este email.' },
      } as AxiosResponse),
    );
    renderPage();

    const dialog = await openEditFor('bruno@tourvr.test');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Salvar' }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent('Ja existe um usuario');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('cancelar fecha a janela sem salvar', async () => {
    renderPage();

    const dialog = await openEditFor('bruno@tourvr.test');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(updateUserAdmin).not.toHaveBeenCalled();
  });

  it('mudar o proprio e-mail encerra a sessao', async () => {
    vi.mocked(updateUserAdmin).mockResolvedValue({ ...self, email: 'ana.souza@tourvr.test' });
    renderPage();

    const dialog = await openEditFor('ana@tourvr.test');
    expect(
      within(dialog).getByText('Se mudar o seu próprio e-mail, você precisará entrar de novo.'),
    ).toBeVisible();
    const email = within(dialog).getByLabelText('E-mail');
    await userEvent.clear(email);
    await userEvent.type(email, 'ana.souza@tourvr.test');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Salvar' }));

    await vi.waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
    });
  });

  it('editar o proprio nome sem mudar o e-mail mantem a sessao', async () => {
    vi.mocked(updateUserAdmin).mockResolvedValue({ ...self, full_name: 'Ana S.' });
    renderPage();

    const dialog = await openEditFor('ana@tourvr.test');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Dados do usuário atualizados.')).toBeInTheDocument();
    expect(signOut).not.toHaveBeenCalled();
  });
});

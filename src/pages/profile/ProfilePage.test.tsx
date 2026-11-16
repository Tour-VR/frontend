import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, type AxiosResponse } from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { changeMyPassword, updateMe } from '../../services/profile';
import { buildAuthValue, buildUser } from '../../test/factories';
import { ProfilePage } from './ProfilePage';

vi.mock('../../contexts/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../../services/profile');

const updateUser = vi.fn();

function apiError(status: number, detail: string) {
  return new AxiosError('erro', 'ERR', undefined, undefined, {
    status,
    data: { detail },
  } as AxiosResponse);
}

function renderPage() {
  vi.mocked(useAuth).mockReturnValue(
    buildAuthValue({ user: buildUser(), isAuthenticated: true, isAdmin: true, updateUser }),
  );
  return render(<ProfilePage />);
}

async function fillPassword(current: string, next: string, confirm: string) {
  if (current) await userEvent.type(screen.getByLabelText('Senha atual'), current);
  await userEvent.type(screen.getByLabelText('Nova senha'), next);
  await userEvent.type(screen.getByLabelText('Confirmar nova senha'), confirm);
  await userEvent.click(screen.getByRole('button', { name: 'Trocar senha' }));
}

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra o e-mail somente leitura e os dados atuais', () => {
    renderPage();

    expect(screen.getByLabelText('E-mail')).toHaveValue('ana@tourvr.test');
    expect(screen.getByLabelText('E-mail')).toBeDisabled();
    expect(screen.getByLabelText('Nome completo')).toHaveValue('Ana Souza');
    expect(screen.getByLabelText('Username')).toHaveValue('ana');
  });

  it('salvar chama updateMe e updateUser', async () => {
    const updated = buildUser({ full_name: 'Ana Maria' });
    vi.mocked(updateMe).mockResolvedValue(updated);
    renderPage();

    await userEvent.clear(screen.getByLabelText('Nome completo'));
    await userEvent.type(screen.getByLabelText('Nome completo'), 'Ana Maria');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Perfil atualizado.')).toBeInTheDocument();
    expect(updateMe).toHaveBeenCalledWith({ full_name: 'Ana Maria', username: 'ana' });
    expect(updateUser).toHaveBeenCalledWith(updated);
  });

  it('erro ao salvar mostra o detail do backend', async () => {
    vi.mocked(updateMe).mockRejectedValue(apiError(400, 'Ja existe um usuario com este username.'));
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ja existe um usuario com este username.',
    );
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('senha divergente ou fraca bloqueia o envio', async () => {
    renderPage();

    await fillPassword('', 'curta', 'outra');

    expect(screen.getByText('Informe a senha atual.')).toBeInTheDocument();
    expect(
      screen.getByText('A senha deve ter pelo menos 8 caracteres e incluir letra e número.'),
    ).toBeInTheDocument();
    expect(screen.getByText('As senhas não conferem.')).toBeInTheDocument();
    expect(changeMyPassword).not.toHaveBeenCalled();
  });

  it('troca a senha, limpa os campos e confirma', async () => {
    vi.mocked(changeMyPassword).mockResolvedValue({ message: 'ok' });
    renderPage();

    await fillPassword('antiga123', 'nova12345', 'nova12345');

    expect(await screen.findByText('Senha atualizada com sucesso.')).toBeInTheDocument();
    expect(changeMyPassword).toHaveBeenCalledWith({
      current_password: 'antiga123',
      new_password: 'nova12345',
    });
    expect(screen.getByLabelText('Senha atual')).toHaveValue('');
    expect(screen.getByLabelText('Nova senha')).toHaveValue('');
  });

  it('400 do backend aparece no campo senha atual', async () => {
    vi.mocked(changeMyPassword).mockRejectedValue(apiError(400, 'Senha atual invalida.'));
    renderPage();

    await fillPassword('errada123', 'nova12345', 'nova12345');

    expect(await screen.findByText('Senha atual invalida.')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha atual')).toHaveAttribute('aria-invalid', 'true');
  });

  it('outros erros aparecem no campo da nova senha', async () => {
    vi.mocked(changeMyPassword).mockRejectedValue(
      apiError(422, 'A nova senha deve ser diferente da senha atual.'),
    );
    renderPage();

    await fillPassword('igual1234', 'igual1234', 'igual1234');

    expect(screen.getByLabelText('Nova senha')).toHaveAttribute('aria-invalid', 'true');
  });
});

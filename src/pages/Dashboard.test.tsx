import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMetricsOverview } from '../services/metrics';
import { buildAuthValue, buildMetrics, buildUser } from '../test/factories';
import type { User } from '../types';
import { Dashboard } from './Dashboard';

vi.mock('../contexts/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../services/metrics');

function renderDashboard(user: User | null = buildUser()) {
  vi.mocked(useAuth).mockReturnValue(buildAuthValue({ user, isAuthenticated: user !== null }));
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </MemoryRouter>,
  );
}

function cardValue(label: string) {
  return within(screen.getByRole('group', { name: label })).getByRole('definition');
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.mocked(getMetricsOverview).mockResolvedValue(buildMetrics());
  });

  it.each([
    ['full_name', buildUser(), 'Ana Souza'],
    ['username', buildUser({ full_name: null }), 'ana'],
    ['email', buildUser({ full_name: null, username: null }), 'ana@tourvr.test'],
    ['texto padrao', null, 'Administrador'],
  ])('exibe o nome usando %s', async (_field, user, expectedName) => {
    renderDashboard(user);

    expect(screen.getByText(`Bem-vindo(a) de volta, ${expectedName}.`)).toBeInTheDocument();
    await screen.findByRole('group', { name: 'Pontos cadastrados' });
  });

  it('mostra os 5 cartoes com os valores reais e o ranking', async () => {
    renderDashboard();

    expect(screen.getByRole('status')).toHaveTextContent('Carregando');
    await screen.findByRole('group', { name: 'Pontos cadastrados' });
    expect(cardValue('Pontos cadastrados')).toHaveTextContent('7');
    expect(cardValue('Pontos publicados')).toHaveTextContent('5');
    expect(cardValue('Visitas (total)')).toHaveTextContent('31');
    expect(cardValue('Visitas nos últimos 7 dias')).toHaveTextContent('9');
    expect(cardValue('Visitas AR / VR')).toHaveTextContent('AR22VR13');
    const ranking = screen.getByRole('listitem');
    expect(ranking).toHaveTextContent('Biblioteca Central');
    expect(ranking).toHaveTextContent('17');
    expect(document.body).not.toHaveTextContent(/\b124\b/);
  });

  it('mostra a mensagem quando ainda nao ha visitas', async () => {
    vi.mocked(getMetricsOverview).mockResolvedValue(buildMetrics({ top_points: [] }));
    renderDashboard();

    expect(await screen.findByText('Ainda não há visitas registradas.')).toBeInTheDocument();
  });

  it('mostra erro e tenta novamente', async () => {
    vi.mocked(getMetricsOverview)
      .mockRejectedValueOnce(new Error('falha'))
      .mockResolvedValue(buildMetrics());
    renderDashboard();

    await userEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByRole('group', { name: 'Visitas (total)' })).toBeInTheDocument();
  });

  it('Atualizar busca as metricas de novo', async () => {
    renderDashboard();
    await screen.findByRole('group', { name: 'Visitas (total)' });
    vi.mocked(getMetricsOverview).mockResolvedValue(buildMetrics({ visits_total: 32 }));

    await userEvent.click(screen.getByRole('button', { name: 'Atualizar' }));

    await vi.waitFor(() => {
      expect(cardValue('Visitas (total)')).toHaveTextContent('32');
    });
    expect(getMetricsOverview).toHaveBeenCalledTimes(2);
  });
});

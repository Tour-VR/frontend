import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MAX_CONNECTIONS, VR_MESSAGES } from '../../constants/points';
import { listPoints, updatePoint } from '../../services/points';
import { buildPoint } from '../../test/factories';
import type { Point, PointConnection } from '../../types';
import { ConnectionsEditor } from './ConnectionsEditor';

vi.mock('../../services/points');

const SELF = buildPoint();
const CANTINA = buildPoint({ id: 'c1', slug: 'cantina', name: 'Cantina', status: 'published' });
const GINASIO = buildPoint({ id: 'g1', slug: 'ginasio', name: 'Ginásio', status: 'draft' });

function setup(point: Point = SELF) {
  const onSaved = vi.fn();
  vi.mocked(listPoints).mockResolvedValue([SELF, CANTINA, GINASIO]);
  vi.mocked(updatePoint).mockImplementation((_id, payload) =>
    Promise.resolve(buildPoint({ connections: payload.connections ?? [] })),
  );
  render(<ConnectionsEditor point={point} onSaved={onSaved} />);
  return { onSaved };
}

function selects() {
  return screen.getAllByLabelText('Destino');
}

async function waitTargets() {
  expect(await screen.findAllByText('Cantina (Publicado)')).not.toHaveLength(0);
}

describe('ConnectionsEditor', () => {
  it('adiciona conexao com rotulo pre-preenchido e salva', async () => {
    const { onSaved } = setup();
    await userEvent.click(screen.getByRole('button', { name: VR_MESSAGES.addConnection }));
    await waitTargets();

    await userEvent.selectOptions(selects()[0], 'cantina');
    expect(screen.getByLabelText('Rótulo')).toHaveValue('Cantina');
    await userEvent.clear(screen.getByLabelText('Ângulo'));
    await userEvent.type(screen.getByLabelText('Ângulo'), '90');
    await userEvent.click(screen.getByRole('button', { name: VR_MESSAGES.saveConnections }));

    expect(updatePoint).toHaveBeenCalledWith(SELF.id, {
      connections: [{ target_slug: 'cantina', label: 'Cantina', yaw_degrees: 90 }],
    });
    expect(await screen.findByText(VR_MESSAGES.connectionsSaved)).toBeInTheDocument();
    expect(onSaved).toHaveBeenCalledOnce();
  });

  it('o proprio ponto nao aparece e o destino usado fica desabilitado', async () => {
    const existing: PointConnection[] = [
      { target_slug: 'cantina', label: 'Cantina', yaw_degrees: 0 },
    ];
    setup(buildPoint({ connections: existing }));
    await waitTargets();
    await userEvent.click(screen.getByRole('button', { name: VR_MESSAGES.addConnection }));

    const second = selects()[1];
    expect(within(second).queryByText(/Biblioteca Central/)).not.toBeInTheDocument();
    expect(within(second).getByRole('option', { name: 'Cantina (Publicado)' })).toBeDisabled();
    expect(within(second).getByRole('option', { name: 'Ginásio (Rascunho)' })).toBeEnabled();
  });

  it('destino em rascunho mostra o selo de invisivel', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: VR_MESSAGES.addConnection }));
    await waitTargets();

    await userEvent.selectOptions(selects()[0], 'ginasio');

    expect(screen.getByText(VR_MESSAGES.draftTarget)).toBeInTheDocument();
  });

  it('mantem o rotulo editado ao trocar o destino', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: VR_MESSAGES.addConnection }));
    await waitTargets();
    await userEvent.selectOptions(selects()[0], 'cantina');
    await userEvent.clear(screen.getByLabelText('Rótulo'));
    await userEvent.type(screen.getByLabelText('Rótulo'), 'Lanchonete');

    await userEvent.selectOptions(selects()[0], 'ginasio');

    expect(screen.getByLabelText('Rótulo')).toHaveValue('Lanchonete');
  });

  it('remove uma conexao', async () => {
    setup(buildPoint({ connections: [{ target_slug: 'cantina', label: 'C', yaw_degrees: 0 }] }));
    await waitTargets();

    await userEvent.click(screen.getByRole('button', { name: 'Remover' }));

    expect(screen.getByText(VR_MESSAGES.connectionsEmpty)).toBeInTheDocument();
  });

  it('desabilita o botao de adicionar ao chegar no limite', async () => {
    const full = Array.from({ length: MAX_CONNECTIONS }, (_, i) => ({
      target_slug: `ponto-${String(i)}`,
      label: `Ponto ${String(i)}`,
      yaw_degrees: 0,
    }));
    setup(buildPoint({ connections: full }));
    await waitTargets();

    expect(screen.getByRole('button', { name: VR_MESSAGES.addConnection })).toBeDisabled();
    expect(screen.getByText(VR_MESSAGES.connectionsLimit)).toBeInTheDocument();
  });

  it('linha incompleta nao e enviada', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: VR_MESSAGES.addConnection }));
    await waitTargets();

    await userEvent.click(screen.getByRole('button', { name: VR_MESSAGES.saveConnections }));

    expect(screen.getByRole('alert')).toHaveTextContent(VR_MESSAGES.connectionIncomplete);
    expect(updatePoint).not.toHaveBeenCalled();
  });

  it('mostra o erro do backend ao salvar', async () => {
    setup(buildPoint({ connections: [{ target_slug: 'cantina', label: 'C', yaw_degrees: 0 }] }));
    vi.mocked(updatePoint).mockRejectedValue(new Error('rede'));
    await waitTargets();

    await userEvent.click(screen.getByRole('button', { name: VR_MESSAGES.saveConnections }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível concluir');
  });

  it('mostra erro quando a lista de destinos falha', async () => {
    vi.mocked(listPoints).mockRejectedValue(new Error('rede'));
    render(<ConnectionsEditor point={SELF} onSaved={vi.fn()} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível concluir');
  });
});

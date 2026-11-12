import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RowActions } from './RowActions';

function renderActions() {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  render(
    <RowActions
      label="Acoes do ponto Praca"
      actions={[
        { label: 'Editar', onSelect: onEdit },
        { label: 'Excluir', onSelect: onDelete, danger: true },
      ]}
    />,
  );
  return { onEdit, onDelete };
}

describe('RowActions', () => {
  it('abre o menu pelo clique e chama a acao escolhida', async () => {
    const { onDelete } = renderActions();

    await userEvent.click(screen.getByRole('button', { name: 'Acoes do ponto Praca' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Excluir' }));

    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('funciona pelo teclado', async () => {
    const { onEdit } = renderActions();

    screen.getByRole('button', { name: 'Acoes do ponto Praca' }).focus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('menu');
    await userEvent.keyboard('{Enter}');

    expect(onEdit).toHaveBeenCalledOnce();
  });
});

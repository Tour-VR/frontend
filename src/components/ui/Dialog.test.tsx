import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Dialog } from './Dialog';

function Harness({ description }: { description?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        Abrir
      </button>
      <Dialog open={open} onOpenChange={setOpen} title="Excluir ponto" description={description}>
        <p>Conteudo</p>
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('abre com titulo e descricao e fecha com Esc', async () => {
    render(<Harness description="Nao pode ser desfeito" />);

    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const dialog = screen.getByRole('dialog', { name: 'Excluir ponto' });
    expect(dialog).toHaveTextContent('Nao pode ser desfeito');
    expect(dialog).toHaveTextContent('Conteudo');

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('fecha pelo botao Fechar', async () => {
    render(<Harness />);

    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }));

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

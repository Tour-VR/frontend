import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';

describe('estados de feedback', () => {
  it('LoadingState mostra a mensagem', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
  });

  it('ErrorState chama onRetry e omite o botao sem ele', async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<ErrorState message="Falhou" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledOnce();

    rerender(<ErrorState message="Falhou" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('EmptyState mostra mensagem e acao opcional', () => {
    render(<EmptyState message="Nada aqui" action={<button type="button">Criar</button>} />);
    expect(screen.getByText('Nada aqui')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar' })).toBeInTheDocument();
  });
});

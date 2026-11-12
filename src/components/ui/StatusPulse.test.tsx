import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';
import { StatusPulse } from './StatusPulse';

describe('StatusPulse', () => {
  it('online mostra o texto e o anel pulsante', () => {
    render(<StatusPulse online />);

    expect(screen.getByText('online')).toBeInTheDocument();
    expect(screen.getByTestId('status-pulse-ring')).toBeInTheDocument();
  });

  it('offline mostra o texto sem anel', () => {
    render(<StatusPulse online={false} />);

    expect(screen.getByText('offline')).toBeInTheDocument();
    expect(screen.queryByTestId('status-pulse-ring')).toBeNull();
  });
});

describe('Spinner', () => {
  it('tem rotulo acessivel', () => {
    render(<Spinner />);

    expect(screen.getByRole('img', { name: 'Carregando' })).toBeInTheDocument();
  });
});

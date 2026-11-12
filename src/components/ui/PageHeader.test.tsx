import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renderiza titulo, descricao e acoes', () => {
    render(
      <PageHeader
        title="Pontos"
        description="Gerencie os pontos"
        actions={<button>Novo</button>}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Pontos' })).toBeInTheDocument();
    expect(screen.getByText('Gerencie os pontos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument();
  });

  it('omite descricao e acoes quando nao informadas', () => {
    const { container } = render(<PageHeader title="Pontos" />);

    expect(container.querySelector('p')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });
});

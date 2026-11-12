import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';

function renderNav(path = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SidebarNav />
    </MemoryRouter>,
  );
}

describe('SidebarNav', () => {
  it('item habilitado e um link para a rota', () => {
    renderNav();

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
  });

  it('marca o item da rota atual como ativo', () => {
    renderNav('/dashboard');

    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('bg-indigo-50', 'text-indigo-700');
  });

  it('item fora da rota atual nao fica ativo', () => {
    renderNav('/outra');

    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveClass('bg-indigo-50');
  });

  it('item desabilitado nao e link, tem aria-disabled e "em breve"', () => {
    renderNav();

    expect(screen.queryByRole('link', { name: /Pontos/ })).not.toBeInTheDocument();
    const item = screen.getByText('Pontos').closest('[aria-disabled]');
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(item).toHaveTextContent('em breve');
  });

  it('chama onNavigate ao clicar num item habilitado', async () => {
    const onNavigate = vi.fn();
    render(
      <MemoryRouter initialEntries={['/outra']}>
        <SidebarNav onNavigate={onNavigate} />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('link', { name: 'Dashboard' }));

    expect(onNavigate).toHaveBeenCalledOnce();
  });
});

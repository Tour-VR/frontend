import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapPin } from 'lucide-react';
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

  it('item Pontos e um link para /pontos', () => {
    renderNav();

    expect(screen.getByRole('link', { name: 'Pontos' })).toHaveAttribute('href', '/pontos');
  });

  it('item QR Codes e um link para /qrcodes', () => {
    renderNav();

    expect(screen.getByRole('link', { name: 'QR Codes' })).toHaveAttribute('href', '/qrcodes');
  });

  it('item desabilitado nao e link, tem aria-disabled e "em breve"', () => {
    render(
      <MemoryRouter>
        <SidebarNav items={[{ label: 'Futuro', to: '/futuro', icon: MapPin, enabled: false }]} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('link', { name: /Futuro/ })).not.toBeInTheDocument();
    const item = screen.getByText('Futuro').closest('[aria-disabled]');
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

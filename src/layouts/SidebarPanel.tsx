import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SidebarNav } from './SidebarNav';

interface SidebarPanelProps {
  /** Chamado ao escolher um item do menu (a gaveta usa para se fechar). */
  onNavigate?: () => void;
}

/** Conteudo da barra lateral: marca, menu e botao Sair. Usado na barra fixa e na gaveta. */
export function SidebarPanel({ onNavigate }: SidebarPanelProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    void navigate('/login', { replace: true });
  }

  return (
    <>
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-xl font-bold text-indigo-600">TourVR Admin</span>
      </div>

      <SidebarNav onNavigate={onNavigate} />

      <div className="border-t border-gray-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-3 py-2 font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair do sistema
        </button>
      </div>
    </>
  );
}

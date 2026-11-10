import { LogOut } from 'lucide-react';
import { navigationItems } from '../../constants/dashboard';

interface SidebarProps {
  onLogout: () => void;
}

/** Barra lateral com titulo, menu e botao de saida. */
export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-indigo-600">OculosVR Admin</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map(({ label, icon: Icon, isActive }) => (
          <div
            key={label}
            className={`flex items-center rounded-md px-3 py-2 font-medium ${
              isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'
            }`}
          >
            <Icon className="mr-3 h-5 w-5" />
            {label}
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center rounded-md px-3 py-2 font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair do sistema
        </button>
      </div>
    </aside>
  );
}

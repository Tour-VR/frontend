import { NavLink } from 'react-router-dom';
import { NAV_ITEMS, type NavItem } from '../constants/navigation';

const ITEM_CLASS = 'flex items-center rounded-md px-3 py-2 font-medium';

interface SidebarNavProps {
  items?: NavItem[];
  /** Chamado ao clicar num item habilitado (a gaveta usa para se fechar). */
  onNavigate?: () => void;
}

/** Menu lateral: item habilitado e link; item futuro fica cinza, sem link, com "em breve". */
export function SidebarNav({ items = NAV_ITEMS, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex-1 space-y-1 p-4">
      {items.map(({ label, to, icon: Icon, enabled }) =>
        enabled ? (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `${ITEM_CLASS} ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="mr-3 h-5 w-5" />
            {label}
          </NavLink>
        ) : (
          <span
            key={to}
            aria-disabled="true"
            className={`${ITEM_CLASS} cursor-not-allowed text-gray-400`}
          >
            <Icon className="mr-3 h-5 w-5" />
            {label}
            <span className="ml-auto text-xs font-normal">em breve</span>
          </span>
        ),
      )}
    </nav>
  );
}

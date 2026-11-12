import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export interface RowAction {
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

interface RowActionsProps {
  /** Nome lido pelo leitor de tela, ex.: "Acoes do ponto Praca Central". */
  label: string;
  actions: RowAction[];
}

/** Botao "..." com o menu de acoes de uma linha de tabela. */
export function RowActions({ label, actions }: RowActionsProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={label}
        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <MoreHorizontal className="h-5 w-5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="shadow-popover z-(--z-popup) min-w-40 origin-(--radix-dropdown-menu-content-transform-origin) rounded-md bg-white p-1 data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in"
        >
          {actions.map((action) => (
            <DropdownMenu.Item
              key={action.label}
              onSelect={action.onSelect}
              className={`cursor-pointer rounded px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 ${
                action.danger ? 'text-red-600' : 'text-gray-700'
              }`}
            >
              {action.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

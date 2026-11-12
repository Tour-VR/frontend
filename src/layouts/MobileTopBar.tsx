import * as RadixDialog from '@radix-ui/react-dialog';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { SidebarPanel } from './SidebarPanel';

/** Barra do topo em telas menores que md: abre o menu lateral como gaveta deslizante. */
export function MobileTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4">
      <RadixDialog.Root open={open} onOpenChange={setOpen}>
        <RadixDialog.Trigger
          aria-label="Abrir menu"
          className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </RadixDialog.Trigger>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className="fixed inset-0 z-(--z-drawer-scrim) bg-black/40 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
          <RadixDialog.Content
            aria-describedby={undefined}
            className="fixed inset-y-0 left-0 z-(--z-drawer) flex w-64 flex-col bg-white shadow-dialog data-[state=closed]:animate-drawer-out data-[state=open]:animate-drawer-in"
          >
            <RadixDialog.Title className="sr-only">Menu</RadixDialog.Title>
            <SidebarPanel
              onNavigate={() => {
                setOpen(false);
              }}
            />
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
      <span className="text-lg font-bold text-indigo-600">TourVR Admin</span>
    </header>
  );
}

import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Janela modal padrao: fundo com fade, conteudo com escala; fecha com Esc ou no X. */
export function Dialog({ open, onOpenChange, title, description, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-(--z-popup) bg-black/40 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <RadixDialog.Content className="shadow-dialog fixed top-1/2 left-1/2 z-(--z-popup) w-[min(32rem,calc(100vw-2rem))] -translate-1/2 rounded-lg bg-white p-6 data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in">
          <RadixDialog.Title className="text-lg font-semibold text-gray-900">
            {title}
          </RadixDialog.Title>
          {description ? (
            <RadixDialog.Description className="mt-1 text-sm text-gray-500">
              {description}
            </RadixDialog.Description>
          ) : (
            <RadixDialog.Description className="sr-only">{title}</RadixDialog.Description>
          )}
          <div className="mt-4">{children}</div>
          <RadixDialog.Close
            aria-label="Fechar"
            className="absolute top-4 right-4 rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

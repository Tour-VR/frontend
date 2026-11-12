import type { ReactNode } from 'react';

interface ToolbarProps {
  children: ReactNode;
}

/** Linha de ferramentas acima de uma listagem: busca, filtros, exportar. */
export function Toolbar({ children }: ToolbarProps) {
  return <div className="mb-4 flex flex-wrap items-center gap-3">{children}</div>;
}

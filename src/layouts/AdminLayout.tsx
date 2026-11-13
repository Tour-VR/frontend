import { Outlet } from 'react-router-dom';
import { BELOW_MD_QUERY, useMediaQuery } from '../hooks/useMediaQuery';
import { MobileTopBar } from './MobileTopBar';
import { SidebarPanel } from './SidebarPanel';

/**
 * Moldura das telas do painel: barra lateral fixa a partir de md (768px); abaixo disso,
 * barra no topo com o menu em gaveta. So uma das duas e montada por vez.
 */
export function AdminLayout() {
  const isBelowMd = useMediaQuery(BELOW_MD_QUERY);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row print:bg-white">
      {isBelowMd ? (
        <div className="print:hidden">
          <MobileTopBar />
        </div>
      ) : (
        <aside className="flex w-64 flex-col border-r border-gray-200 bg-white print:hidden">
          <SidebarPanel />
        </aside>
      )}

      <main className="flex-1 p-4 md:p-8 print:p-0">
        <Outlet />
      </main>
    </div>
  );
}

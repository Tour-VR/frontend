import { LayoutDashboard, type LucideIcon, MapPin } from 'lucide-react';

/** Item do menu lateral. `enabled: false` aparece desabilitado, com o rotulo "em breve". */
export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  enabled: boolean;
}

// Os planos 014 e 015 acrescentam itens novos.
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, enabled: true },
  { label: 'Pontos', to: '/pontos', icon: MapPin, enabled: true },
];

import { LayoutDashboard, type LucideIcon, MapPin, QrCode } from 'lucide-react';

/** Item do menu lateral. `enabled: false` aparece desabilitado, com o rotulo "em breve". */
export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  enabled: boolean;
}

// O plano 015 acrescenta itens novos.
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, enabled: true },
  { label: 'Pontos', to: '/pontos', icon: MapPin, enabled: true },
  { label: 'QR Codes', to: '/qrcodes', icon: QrCode, enabled: true },
];

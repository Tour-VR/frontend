import { LayoutDashboard, type LucideIcon, MapPin, QrCode, UserCircle, Users } from 'lucide-react';

/** Item do menu lateral. `enabled: false` aparece desabilitado, com o rotulo "em breve". */
export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  enabled: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, enabled: true },
  { label: 'Pontos', to: '/pontos', icon: MapPin, enabled: true },
  { label: 'QR Codes', to: '/qrcodes', icon: QrCode, enabled: true },
  { label: 'Usuários', to: '/usuarios', icon: Users, enabled: true },
  { label: 'Meu perfil', to: '/perfil', icon: UserCircle, enabled: true },
];

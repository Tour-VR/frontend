import { Box, Settings, User as UserIcon } from 'lucide-react';

export const navigationItems = [
  { label: 'Dashboard', icon: Box, isActive: true },
  { label: 'Usuarios', icon: UserIcon, isActive: false },
  { label: 'Configuracoes VR', icon: Settings, isActive: false },
];

export const dashboardMetrics = [
  { label: 'Usuarios Ativos', value: '124' },
  { label: 'Ambientes VR', value: '12' },
  { label: 'Sessoes Hoje', value: '89' },
];

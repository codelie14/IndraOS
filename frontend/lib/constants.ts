export const INDRA_COLORS = {
  primary: '#e94560',
  secondary: '#0f3460',
  dark: '#1a1a2e',
  background: '#16213e',
  surface: '#1e2749',
  accent: '#f39c12',
  success: '#4CAF50',
  warning: '#ff9800',
  danger: '#f44336',
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/api/ws/system-metrics';

export const REFRESH_INTERVALS = {
  SYSTEM_METRICS: 5000,
  PROCESSES: 10000,
  LOGS: 15000,
} as const;

export const NAVIGATION_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/system', label: 'System Info', icon: 'Monitor' },
  { path: '/performance', label: 'Performance', icon: 'TrendingUp' },
  { path: '/processes', label: 'Processes', icon: 'Cpu' },
  { path: '/services', label: 'Services', icon: 'Settings2' },
  { path: '/security', label: 'Security', icon: 'Shield' },
  { path: '/network', label: 'Network', icon: 'Wifi' },
  { path: '/logs', label: 'Logs', icon: 'FileText' },
  { path: '/ai-analysis', label: 'AI Analysis', icon: 'Brain' },
  { path: '/reports', label: 'Reports', icon: 'BarChart3' },
  { path: '/settings', label: 'Settings', icon: 'Cog' },
] as const;
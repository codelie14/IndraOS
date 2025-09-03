import { create } from 'zustand';
import { SystemInfo, SystemMetrics, Process, AIInsight, Alert } from '@/types/system';

interface SystemStore {
  // System data
  systemInfo: SystemInfo | null;
  metrics: SystemMetrics | null;
  processes: Process[];
  insights: AIInsight[];
  alerts: Alert[];
  
  // UI state
  sidebarCollapsed: boolean;
  darkMode: boolean;
  isLoading: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  
  // Actions
  setSystemInfo: (info: SystemInfo) => void;
  setMetrics: (metrics: SystemMetrics) => void;
  setProcesses: (processes: Process[]) => void;
  addInsight: (insight: AIInsight) => void;
  addAlert: (alert: Alert) => void;
  markAlertAsRead: (id: string) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setLoading: (loading: boolean) => void;
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => void;
}

export const useSystemStore = create<SystemStore>((set, get) => ({
  // Initial state
  systemInfo: null,
  metrics: null,
  processes: [],
  insights: [],
  alerts: [],
  sidebarCollapsed: false,
  darkMode: true,
  isLoading: false,
  connectionStatus: 'disconnected',
  
  // Actions
  setSystemInfo: (info) => set({ systemInfo: info }),
  setMetrics: (metrics) => set({ metrics }),
  setProcesses: (processes) => set({ processes }),
  addInsight: (insight) => set(state => ({ 
    insights: [insight, ...state.insights].slice(0, 50) 
  })),
  addAlert: (alert) => set(state => ({ 
    alerts: [alert, ...state.alerts].slice(0, 100) 
  })),
  markAlertAsRead: (id) => set(state => ({
    alerts: state.alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    )
  })),
  toggleSidebar: () => set(state => ({ 
    sidebarCollapsed: !state.sidebarCollapsed 
  })),
  toggleDarkMode: () => set(state => ({ 
    darkMode: !state.darkMode 
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
}));
import axios from 'axios';
import type { SystemInfo, SystemMetrics, Process, AIInsight } from '@/types/system';
import { API_BASE_URL } from './constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for loading states
api.interceptors.request.use((config) => {
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

export const systemAPI = {
  getSystemInfo: async (): Promise<SystemInfo> => {
    const { data } = await api.get('/system/info');
    return data;
  },

  getMetrics: async (): Promise<SystemMetrics> => {
    const { data } = await api.get('/system/performance');
    return data;
  },

  getProcesses: async (): Promise<Process[]> => {
    const { data } = await api.get('/system/processes');
    return data;
  },

  killProcess: async (processId: number): Promise<void> => {
    await api.post(`/system/processes/${processId}/kill`);
  },

  suspendProcess: async (processId: number): Promise<void> => {
    await api.post(`/system/processes/${processId}/suspend`);
  },

  getSecurityAnalysis: async () => {
    const { data } = await api.get('/system/security');
    return data;
  },

  getNetworkAnalysis: async () => {
    const { data } = await api.get('/system/network');
    return data;
  },

  requestAIAnalysis: async (): Promise<AIInsight[]> => {
    const { data } = await api.post('/ai/analyze');
    return data;
  },

  generateReport: async (format: string, metrics: string[]) => {
    const { data } = await api.post('/reports/generate', { format, metrics });
    return data;
  },

  optimizeSystem: async () => {
    const { data } = await api.post('/system/optimize');
    return data;
  },
};

export default api;
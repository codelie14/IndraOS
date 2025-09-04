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
  // System endpoints
  getSystemInfo: async (): Promise<SystemInfo> => {
    const { data } = await api.get('/system');
    return data;
  },

  getSystemOverview: async () => {
    const { data } = await api.get('/system/overview');
    return data;
  },

  getMetrics: async (limit: number = 100): Promise<SystemMetrics[]> => {
    const { data } = await api.get(`/system/metrics?limit=${limit}`);
    return data;
  },

  getLatestMetrics: async (): Promise<SystemMetrics> => {
    const { data } = await api.get('/system/metrics/latest');
    return data;
  },

  collectMetrics: async () => {
    const { data } = await api.post('/system/metrics/collect');
    return data;
  },

  // Process endpoints
  getProcesses: async (skip: number = 0, limit: number = 100): Promise<Process[]> => {
    const { data } = await api.get(`/processes?skip=${skip}&limit=${limit}`);
    return data.processes;
  },

  getProcess: async (pid: number): Promise<Process> => {
    const { data } = await api.get(`/processes/${pid}`);
    return data;
  },

  syncProcesses: async () => {
    const { data } = await api.get('/processes/sync');
    return data;
  },

  killProcess: async (pid: number): Promise<void> => {
    await api.delete(`/processes/${pid}`);
  },

  // Service endpoints
  getServices: async (skip: number = 0, limit: number = 100) => {
    const { data } = await api.get(`/services?skip=${skip}&limit=${limit}`);
    return data.services;
  },

  getService: async (name: string) => {
    const { data } = await api.get(`/services/${name}`);
    return data;
  },

  syncServices: async () => {
    const { data } = await api.get('/services/sync');
    return data;
  },

  startService: async (name: string) => {
    const { data } = await api.post(`/services/${name}/start`);
    return data;
  },

  stopService: async (name: string) => {
    const { data } = await api.post(`/services/${name}/stop`);
    return data;
  },

  restartService: async (name: string) => {
    const { data } = await api.post(`/services/${name}/restart`);
    return data;
  },

  // Network endpoints
  getNetworkInterfaces: async (skip: number = 0, limit: number = 100) => {
    const { data } = await api.get(`/network/interfaces?skip=${skip}&limit=${limit}`);
    return data.interfaces;
  },

  getNetworkInterface: async (name: string) => {
    const { data } = await api.get(`/network/interfaces/${name}`);
    return data;
  },

  syncNetworkInterfaces: async () => {
    const { data } = await api.get('/network/interfaces/sync');
    return data;
  },

  getNetworkStats: async () => {
    const { data } = await api.get('/network/stats');
    return data;
  },

  getNetworkConnections: async () => {
    const { data } = await api.get('/network/connections');
    return data;
  },

  // Security endpoints
  getSecurityEvents: async (skip: number = 0, limit: number = 100, severity?: string, resolved?: boolean) => {
    const params = new URLSearchParams();
    if (skip) params.append('skip', skip.toString());
    if (limit) params.append('limit', limit.toString());
    if (severity) params.append('severity', severity);
    if (resolved !== undefined) params.append('resolved', resolved.toString());
    
    const { data } = await api.get(`/security/events?${params.toString()}`);
    return data.events;
  },

  getSecurityEvent: async (eventId: number) => {
    const { data } = await api.get(`/security/events/${eventId}`);
    return data;
  },

  resolveSecurityEvent: async (eventId: number) => {
    const { data } = await api.post(`/security/events/${eventId}/resolve`);
    return data;
  },

  deleteSecurityEvent: async (eventId: number) => {
    await api.delete(`/security/events/${eventId}`);
  },

  getSecurityStats: async () => {
    const { data } = await api.get('/security/stats');
    return data;
  },

  scanSecurity: async () => {
    const { data } = await api.post('/security/scan');
    return data;
  },

  // Authentication endpoints
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const { data } = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  register: async (userData: { username: string; email: string; password: string; full_name?: string }) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  getCurrentUser: async (token: string) => {
    const { data } = await api.get('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return data;
  },
};

export default api;
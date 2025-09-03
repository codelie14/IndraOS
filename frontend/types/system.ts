export interface SystemInfo {
  hostname: string;
  platform: string;
  architecture: string;
  cpuModel: string;
  totalMemory: number;
  osVersion: string;
  uptime: number;
}

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    frequency: number;
    temperature?: number;
  };
  memory: {
    used: number;
    total: number;
    available: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
    readSpeed: number;
    writeSpeed: number;
  };
  network: {
    downloadSpeed: number;
    uploadSpeed: number;
    packetsReceived: number;
    packetsSent: number;
  };
}

export interface Process {
  id: number;
  name: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  status: 'running' | 'sleeping' | 'stopped';
  priority: 'low' | 'normal' | 'high' | 'realtime';
  owner: string;
  startTime: string;
}

export interface AIInsight {
  id: string;
  type: 'optimization' | 'security' | 'performance' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  timestamp: string;
  applied: boolean;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}
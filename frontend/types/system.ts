export interface SystemInfo {
  status: string;
  version: string;
  uptime?: number;
  last_update?: string;
}

export interface SystemMetrics {
  id: number;
  timestamp: string;
  cpu_usage?: number;
  cpu_temperature?: number;
  cpu_frequency?: number;
  memory_usage?: number;
  memory_available?: number;
  memory_total?: number;
  disk_usage?: number;
  disk_available?: number;
  disk_total?: number;
  network_in?: number;
  network_out?: number;
  system_status: string;
  uptime?: number;
}

export interface Process {
  id: number;
  pid: number;
  name: string;
  command?: string;
  cpu_usage?: number;
  memory_usage?: number;
  disk_usage?: number;
  status?: string;
  owner?: string;
  priority?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  display_name?: string;
  description?: string;
  status: string;
  start_type: string;
  path?: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkInterface {
  id: number;
  name: string;
  display_name?: string;
  mac_address?: string;
  ip_address?: string;
  netmask?: string;
  gateway?: string;
  status: string;
  speed?: number;
  created_at: string;
  updated_at: string;
}

export interface SecurityEvent {
  id: number;
  timestamp: string;
  event_type: string;
  severity: string;
  source?: string;
  description: string;
  user_id?: number;
  ip_address?: string;
  resolved: boolean;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  is_superuser: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface SystemOverview {
  system_info: SystemInfo;
  current_metrics?: SystemMetrics;
  active_processes_count: number;
  running_services_count: number;
  network_interfaces_count: number;
  security_alerts_count: number;
}

export interface ProcessList {
  processes: Process[];
  total: number;
  page: number;
  size: number;
}

export interface ServiceList {
  services: Service[];
  total: number;
  page: number;
  size: number;
}

export interface NetworkInterfaceList {
  interfaces: NetworkInterface[];
  total: number;
  page: number;
  size: number;
}

export interface SecurityEventList {
  events: SecurityEvent[];
  total: number;
  page: number;
  size: number;
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
import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_URL } from './constants';
import { useSystemStore } from '@/store/useSystemStore';
import type { SystemMetrics, Process, Alert, AIInsight } from '@/types/system';

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) return;

    // Don't attempt connection in SSR
    if (typeof window === 'undefined') return;

    // Disable WebSocket connections since no backend is running
    console.log('WebSocket connections disabled - no backend server available');
    return;

    this.socket = io(WEBSOCKET_URL, {
      transports: ['websocket'],
      timeout: 20000,
      autoConnect: false,
    });

    this.setupEventListeners();
    this.socket.connect();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    const store = useSystemStore.getState();

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      store.setConnectionStatus('connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      store.setConnectionStatus('disconnected');
      this.scheduleReconnect();
    });

    this.socket.on('system:metrics:update', (metrics: SystemMetrics) => {
      store.setMetrics(metrics);
    });

    this.socket.on('process:status:change', (processes: Process[]) => {
      store.setProcesses(processes);
    });

    this.socket.on('alert:new', (alert: Alert) => {
      store.addAlert(alert);
    });

    this.socket.on('ai:analysis:complete', (insight: AIInsight) => {
      store.addInsight(insight);
    });

    this.socket.on('system:health:critical', (data: any) => {
      store.addAlert({
        id: `critical-${Date.now()}`,
        type: 'error',
        title: 'Critical System Alert',
        message: data.message,
        timestamp: new Date().toISOString(),
        read: false,
      });
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      store.setConnectionStatus('disconnected');
      // Don't attempt reconnection if backend is not available
      if (error.message.includes('websocket error')) {
        console.log('Backend WebSocket server not available - running in offline mode');
        return;
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
    this.reconnectAttempts++;

    setTimeout(() => {
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

export const wsClient = new WebSocketClient();
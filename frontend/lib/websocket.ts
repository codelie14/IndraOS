const WEBSOCKET_URL = 'ws://localhost:8000/api/ws/system-metrics';
import { useSystemStore } from '@/store/useSystemStore';
import type { SystemMetrics } from '@/types/system';

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimeoutId: NodeJS.Timeout | null = null;

  connect() {
    // Avoid multiple connections
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already connected.');
      return;
    }
    
    // Don't attempt connection in SSR
    if (typeof window === 'undefined') {
      return;
    }

    const store = useSystemStore.getState();
    store.setConnectionStatus('connecting');

    this.ws = new WebSocket(WEBSOCKET_URL);

    this.ws.onopen = () => {
      console.log('WebSocket connected successfully.');
      store.setConnectionStatus('connected');
      this.reconnectAttempts = 0;
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId);
        this.reconnectTimeoutId = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data: SystemMetrics = JSON.parse(event.data);
        // Assuming the message is for system metrics
        store.setMetrics(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      store.setConnectionStatus('disconnected');
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected.');
      store.setConnectionStatus('disconnected');
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached. Stopping reconnection.');
      return;
    }

    const delay = Math.min(30000, Math.pow(2, this.reconnectAttempts) * 1000);
    this.reconnectAttempts++;

    console.log(`WebSocket disconnected. Attempting to reconnect in ${delay / 1000}s... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
    }

    this.reconnectTimeoutId = setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsClient = new WebSocketClient();

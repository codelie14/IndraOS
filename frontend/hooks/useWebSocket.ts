'use client';

import { useEffect } from 'react';
import { wsClient } from '@/lib/websocket';
import { useSystemStore } from '@/store/useSystemStore';

export function useWebSocket() {
  const { connectionStatus, setConnectionStatus } = useSystemStore();

  useEffect(() => {
    // Initialize connection only if not already connected or connecting
    if (connectionStatus !== 'connected' && connectionStatus !== 'connecting') {
      wsClient.connect();
    }

    return () => {
      // Disconnect only when the application is shutting down.
      // This cleanup function will be called when the root component unmounts.
      // wsClient.disconnect();
    };
  }, [connectionStatus]);

  const isConnected = connectionStatus === 'connected';

  return {
    isConnected,
    connectionStatus,
  };
}
'use client';

import { useEffect, useCallback } from 'react';
import { wsClient } from '@/lib/websocket';
import { useSystemStore } from '@/store/useSystemStore';

export function useWebSocket() {
  const { connectionStatus, setConnectionStatus } = useSystemStore();

  useEffect(() => {
    // Initialize connection
    wsClient.connect();

    return () => {
      wsClient.disconnect();
    };
  }, []);

  // const emit = useCallback((event: string, data?: any) => {
  //   wsClient.emit(event, data);
  // }, []);

  const isConnected = connectionStatus === 'connected';

  return {
    isConnected,
    connectionStatus,
    emit,
  };
}
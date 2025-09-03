'use client';

import { useEffect } from 'react';
import { wsClient } from '@/lib/websocket';
import { useSystemStore } from '@/store/useSystemStore';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { setConnectionStatus } = useSystemStore();

  useEffect(() => {
    // Connect to WebSocket
    setConnectionStatus('connecting');
    // Only connect on client side
    if (typeof window !== 'undefined') {
      wsClient.connect();
    }

    // Cleanup on unmount
    return () => {
      wsClient.disconnect();
    };
  }, [setConnectionStatus]);

  return <>{children}</>;
}
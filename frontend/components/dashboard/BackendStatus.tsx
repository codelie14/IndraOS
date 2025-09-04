'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { systemAPI } from '@/lib/api';

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        setStatus('checking');
        await systemAPI.getSystemInfo();
        setStatus('connected');
        setLastCheck(new Date());
      } catch (error) {
        console.error('Backend connection failed:', error);
        setStatus('disconnected');
        setLastCheck(new Date());
      }
    };

    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'checking':
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Backend Connected';
      case 'disconnected':
        return 'Backend Disconnected';
      case 'checking':
        return 'Checking Connection...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'disconnected':
        return 'text-red-600';
      case 'checking':
        return 'text-yellow-600';
    }
  };

  return (
    <div className="flex items-center space-x-2 p-3 bg-surface rounded-lg border">
      {getStatusIcon()}
      <div>
        <p className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </p>
        {lastCheck && (
          <p className="text-sm text-muted-foreground">
            Last check: {lastCheck.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}

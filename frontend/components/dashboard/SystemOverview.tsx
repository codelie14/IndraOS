'use client';

import { Cpu, HardDrive, MemoryStick, Network } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { useSystemStore } from '@/store/useSystemStore';

export function SystemOverview() {
  const metrics = useSystemStore((state) => state.metrics);
  const connectionStatus = useSystemStore((state) => state.connectionStatus);
  const isLoading = connectionStatus === 'connecting' && !metrics;

  const getCpuColor = (usage?: number) => {
    if (!usage) return 'default';
    if (usage > 80) return 'danger';
    if (usage > 60) return 'warning';
    return 'default';
  };

  const getMemoryColor = (usage?: number) => {
    if (!usage) return 'default';
    if (usage > 85) return 'danger';
    if (usage > 70) return 'warning';
    return 'default';
  };

  const getDiskColor = (usage?: number) => {
    if (!usage) return 'default';
    if (usage > 90) return 'danger';
    if (usage > 80) return 'warning';
    return 'default';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <MetricCard
            key={i}
            title="..."
            value="..."
            icon={Cpu} // Placeholder icon
            loading
          />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 col-span-full">
        <p className="text-muted-foreground">
          {connectionStatus === 'disconnected'
            ? 'Connection to server lost. Attempting to reconnect...'
            : 'Waiting for system data...'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="CPU Usage"
        value={metrics.cpu_usage?.toFixed(1) ?? '0.0'}
        unit="%"
        percentage={metrics.cpu_usage}
        icon={Cpu}
        color={getCpuColor(metrics.cpu_usage)}
      />
      
      <MetricCard
        title="Memory Usage"
        value={metrics.memory_usage?.toFixed(1) ?? '0.0'}
        unit="%"
        percentage={metrics.memory_usage}
        icon={MemoryStick}
        color={getMemoryColor(metrics.memory_usage)}
      />
      
      <MetricCard
        title="Disk Usage"
        value={metrics.disk_usage?.toFixed(1) ?? '0.0'}
        unit="%"
        percentage={metrics.disk_usage}
        icon={HardDrive}
        color={getDiskColor(metrics.disk_usage)}
      />
      
      <MetricCard
        title="Network I/O"
        value={(metrics.network_in ?? 0).toFixed(2)}
        unit="MB/s In"
        icon={Network}
        color="default"
      />
    </div>
  );
}

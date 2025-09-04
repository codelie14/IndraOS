'use client';

import { useEffect, useState } from 'react';
import { Cpu, HardDrive, MemoryStick, Network } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { systemAPI } from '@/lib/api';
import type { SystemOverview as SystemOverviewType } from '@/types/system';

export function SystemOverview() {
  const [overview, setOverview] = useState<SystemOverviewType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        const data = await systemAPI.getSystemOverview();
        setOverview(data);
      } catch (error) {
        console.error('Failed to fetch system overview:', error);
        // Fallback to basic system info if overview fails
        try {
          const systemInfo = await systemAPI.getSystemInfo();
          setOverview({
            system_info: systemInfo,
            current_metrics: null,
            active_processes_count: 0,
            running_services_count: 0,
            network_interfaces_count: 0,
            security_alerts_count: 0
          });
        } catch (fallbackError) {
          console.error('Failed to fetch system info:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
    const interval = setInterval(fetchOverview, 5000);
    return () => clearInterval(interval);
  }, []);

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
          <div key={i} className="h-32 bg-surface animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load system overview</p>
      </div>
    );
  }

  const metrics = overview.current_metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="CPU Usage"
        value={`${metrics?.cpu_usage?.toFixed(1) || '0'}%`}
        icon={Cpu}
        color={getCpuColor(metrics?.cpu_usage)}
        subtitle={`${metrics?.cpu_frequency ? (metrics.cpu_frequency / 1000).toFixed(1) + ' GHz' : 'N/A'}`}
      />
      
      <MetricCard
        title="Memory Usage"
        value={`${metrics?.memory_usage?.toFixed(1) || '0'}%`}
        icon={MemoryStick}
        color={getMemoryColor(metrics?.memory_usage)}
        subtitle={`${metrics?.memory_available?.toFixed(1) || '0'} GB available`}
      />
      
      <MetricCard
        title="Disk Usage"
        value={`${metrics?.disk_usage?.toFixed(1) || '0'}%`}
        icon={HardDrive}
        color={getDiskColor(metrics?.disk_usage)}
        subtitle={`${metrics?.disk_available?.toFixed(1) || '0'} GB free`}
      />
      
      <MetricCard
        title="Network"
        value={`${metrics?.network_in ? (metrics.network_in / 1024).toFixed(1) : '0'} MB/s`}
        icon={Network}
        color="default"
        subtitle={`${overview.network_interfaces_count} interfaces`}
      />
    </div>
  );
}
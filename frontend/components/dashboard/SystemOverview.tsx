'use client';

import { useEffect } from 'react';
import { Cpu, HardDrive, MemoryStick, Network } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { useSystemStore } from '@/store/useSystemStore';
import { systemAPI } from '@/lib/api';

export function SystemOverview() {
  const { metrics, setMetrics, isLoading, setLoading } = useSystemStore();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        // Skip API call since no backend is running
        // const data = await systemAPI.getMetrics();
        // setMetrics(data);
        
        // Use mock data directly
        setMetrics({
          cpu: {
            usage: 45.8,
            cores: 8,
            frequency: 3200,
            temperature: 65
          },
          memory: {
            used: 12.4,
            total: 32,
            available: 19.6,
            percentage: 38.75
          },
          disk: {
            used: 512,
            total: 1024,
            percentage: 50,
            readSpeed: 150,
            writeSpeed: 120
          },
          network: {
            downloadSpeed: 85.6,
            uploadSpeed: 25.3,
            packetsReceived: 125000,
            packetsSent: 98000
          }
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        // Mock data for development
        setMetrics({
          cpu: {
            usage: 45.8,
            cores: 8,
            frequency: 3200,
            temperature: 65
          },
          memory: {
            used: 12.4,
            total: 32,
            available: 19.6,
            percentage: 38.75
          },
          disk: {
            used: 512,
            total: 1024,
            percentage: 50,
            readSpeed: 150,
            writeSpeed: 120
          },
          network: {
            downloadSpeed: 85.6,
            uploadSpeed: 25.3,
            packetsReceived: 125000,
            packetsSent: 98000
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, [setMetrics, setLoading]);

  const getCpuColor = (usage: number) => {
    if (usage > 80) return 'danger';
    if (usage > 60) return 'warning';
    return 'default';
  };

  const getMemoryColor = (usage: number) => {
    if (usage > 85) return 'danger';
    if (usage > 70) return 'warning';
    return 'default';
  };

  const getDiskColor = (usage: number) => {
    if (usage > 90) return 'danger';
    if (usage > 75) return 'warning';
    return 'default';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="CPU Usage"
        value={metrics?.cpu?.usage?.toFixed(1) || '0'}
        unit="%"
        percentage={metrics?.cpu?.usage || 0}
        trend={metrics?.cpu?.usage && metrics.cpu.usage > 50 ? 'up' : 'stable'}
        icon={Cpu}
        color={metrics?.cpu?.usage !== undefined ? getCpuColor(metrics.cpu.usage) : 'default'}
        loading={isLoading}
      />
      
      <MetricCard
        title="Memory"
        value={metrics?.memory?.used?.toFixed(1) || '0'}
        unit={`/ ${metrics?.memory?.total || 0} GB`}
        percentage={metrics?.memory?.percentage || 0}
        trend={metrics?.memory?.percentage && metrics.memory.percentage > 70 ? 'up' : 'stable'}
        icon={MemoryStick}
        color={metrics?.memory?.percentage !== undefined ? getMemoryColor(metrics.memory.percentage) : 'default'}
        loading={isLoading}
      />
      
      <MetricCard
        title="Disk Usage"
        value={metrics?.disk?.used || '0'}
        unit={`/ ${metrics?.disk?.total || 0} GB`}
        percentage={metrics?.disk?.percentage || 0}
        trend="stable"
        icon={HardDrive}
        color={metrics?.disk?.percentage !== undefined ? getDiskColor(metrics.disk.percentage) : 'default'}
        loading={isLoading}
      />
      
      <MetricCard
        title="Network"
        value={metrics?.network?.downloadSpeed?.toFixed(1) || '0'}
        unit="Mbps"
        trend={metrics?.network?.downloadSpeed && metrics.network.downloadSpeed > 50 ? 'up' : 'stable'}
        icon={Network}
        color="success"
        loading={isLoading}
      />
    </div>
  );
}
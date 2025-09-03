'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Monitor, Cpu, HardDrive, MemoryStick, Clock, Thermometer, Clapperboard as Motherboard, Power } from 'lucide-react';
import { useSystemStore } from '@/store/useSystemStore';
import { systemAPI } from '@/lib/api';

export default function SystemPage() {
  const { systemInfo, setSystemInfo } = useSystemStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const info = await systemAPI.getSystemInfo();
        setSystemInfo(info);
      } catch (error) {
        console.error('Failed to fetch system info:', error);
        // Mock data for development
        setSystemInfo({
          hostname: 'INDRA-WORKSTATION',
          platform: 'Windows 11 Pro',
          architecture: 'x64',
          cpuModel: 'Intel Core i7-12700K',
          totalMemory: 32,
          osVersion: '22H2 (Build 22621.2715)',
          uptime: 1440000, // 24 hours in seconds
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, [setSystemInfo]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-[var(--indra-surface)]">
              <CardHeader>
                <div className="h-6 bg-muted/20 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-muted/20 rounded animate-pulse" />
                <div className="h-4 bg-muted/20 rounded animate-pulse w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">System Information</h1>
        <p className="text-muted-foreground">
          Detailed hardware and software configuration under Indra's domain
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[var(--indra-surface)] border-border/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-[var(--indra-red)]" />
                <span>System Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hostname</span>
                  <Badge className="bg-[var(--indra-red)]/20 text-[var(--indra-red)]">
                    {systemInfo?.hostname}
                  </Badge>
                </div>
                
                <Separator className="border-border/30" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Platform</span>
                  <span className="text-sm font-medium text-white">{systemInfo?.platform}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Architecture</span>
                  <span className="text-sm font-medium text-white">{systemInfo?.architecture}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">OS Version</span>
                  <span className="text-sm font-medium text-white">{systemInfo?.osVersion}</span>
                </div>
                
                <Separator className="border-border/30" />
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[var(--indra-accent)]" />
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-medium text-white ml-auto">
                    {systemInfo ? formatUptime(systemInfo.uptime) : '--'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-[var(--indra-surface)] border-border/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-[var(--indra-blue)]" />
                <span>Hardware Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Motherboard className="w-4 h-4 text-[var(--indra-accent)]" />
                  <div className="flex-1">
                    <span className="text-sm text-muted-foreground">CPU Model</span>
                    <p className="text-sm font-medium text-white">{systemInfo?.cpuModel}</p>
                  </div>
                </div>
                
                <Separator className="border-border/30" />
                
                <div className="flex items-center space-x-3">
                  <MemoryStick className="w-4 h-4 text-[var(--indra-accent)]" />
                  <div className="flex-1">
                    <span className="text-sm text-muted-foreground">Total Memory</span>
                    <p className="text-sm font-medium text-white">{systemInfo?.totalMemory} GB</p>
                  </div>
                </div>
                
                <Separator className="border-border/30" />
                
                <div className="flex items-center space-x-3">
                  <Thermometer className="w-4 h-4 text-[var(--indra-accent)]" />
                  <div className="flex-1">
                    <span className="text-sm text-muted-foreground">CPU Temperature</span>
                    <p className="text-sm font-medium text-white">65°C</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Power className="w-4 h-4 text-[var(--indra-accent)]" />
                  <div className="flex-1">
                    <span className="text-sm text-muted-foreground">Power State</span>
                    <Badge className="bg-green-500/20 text-green-400 ml-auto">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, Cpu, HardDrive, MemoryStick, Clock, Server, 
  Database, BarChart, ChevronsRight
} from 'lucide-react';
import { useSystemStore } from '@/store/useSystemStore';
import { systemAPI } from '@/lib/api';
import type { SystemInfo } from '@/types/system';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const InfoRow = ({ label, value, children }: { label: string; value?: string | number | null; children?: React.ReactNode }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground flex items-center">
      <ChevronsRight className="w-4 h-4 mr-2 text-[var(--indra-accent)]" />
      {label}
    </span>
    {children || <span className="text-sm font-medium text-white">{value}</span>}
  </div>
);

const MemoryProgress = ({ label, used, total }: { label: string; used: number; total: number }) => {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-white">
          {used.toFixed(2)} GB / {total.toFixed(2)} GB
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

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
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, [setSystemInfo]);

  const formatUptime = (seconds: number | null | undefined) => {
    if (!seconds) return 'N/A';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBootTime = (isoString: string | null | undefined) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString();
  };

  if (loading || !systemInfo) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-[var(--indra-surface)] border-border/50">
              <CardHeader>
                <div className="h-6 bg-muted/20 rounded animate-pulse w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted/20 rounded animate-pulse" />
                <div className="h-4 bg-muted/20 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted/20 rounded animate-pulse w-5/6" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-[var(--indra-surface)] border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-[var(--indra-red)]" />
                <span>System Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Hostname">
                <Badge className="bg-[var(--indra-red)]/20 text-[var(--indra-red)]">{systemInfo.hostname}</Badge>
              </InfoRow>
              <InfoRow label="Platform" value={systemInfo.platform} />
              <InfoRow label="Architecture" value={systemInfo.architecture} />
              <InfoRow label="OS Version" value={systemInfo.os_version} />
              <Separator className="border-border/30 my-3" />
              <InfoRow label="Boot Time" value={formatBootTime(systemInfo.boot_time)} />
              <InfoRow label="Uptime" value={formatUptime(systemInfo.uptime)} />
            </CardContent>
          </Card>
        </motion.div>

        {/* CPU Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="bg-[var(--indra-surface)] border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-[var(--indra-blue)]" />
                <span>Processor</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="CPU Model" value={systemInfo.cpu_model} />
              <Separator className="border-border/30 my-3" />
              <InfoRow label="Physical Cores" value={systemInfo.cpu_cores_physical} />
              <InfoRow label="Logical Cores" value={systemInfo.cpu_cores_logical} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Memory Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="bg-[var(--indra-surface)] border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <MemoryStick className="w-5 h-5 text-[var(--indra-green)]" />
                <span>Memory</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MemoryProgress label="RAM" used={systemInfo.used_memory} total={systemInfo.total_memory} />
              <MemoryProgress label="Swap" used={systemInfo.used_swap} total={systemInfo.total_swap} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Disk Partitions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-[var(--indra-yellow)]" />
              <span>Disk Partitions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Device</TableHead>
                    <TableHead className="text-muted-foreground">Mountpoint</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Total</TableHead>
                    <TableHead className="text-muted-foreground">Used</TableHead>
                    <TableHead className="text-muted-foreground">Free</TableHead>
                    <TableHead className="text-muted-foreground">Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemInfo.disks.map((disk) => (
                    <TableRow key={disk.device} className="border-border/50 hover:bg-[var(--indra-dark)]/30">
                      <TableCell className="font-medium text-white">{disk.device}</TableCell>
                      <TableCell className="text-muted-foreground">{disk.mountpoint}</TableCell>
                      <TableCell className="text-muted-foreground">{disk.fstype}</TableCell>
                      <TableCell className="text-white">{disk.total_size.toFixed(2)} GB</TableCell>
                      <TableCell className="text-white">{disk.used_size.toFixed(2)} GB</TableCell>
                      <TableCell className="text-white">{disk.free_size.toFixed(2)} GB</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={disk.percent_used} className="w-24 h-2" />
                          <span className="text-sm text-muted-foreground">{disk.percent_used.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Wifi, 
  Globe, 
  Router, 
  Signal,
  Download,
  Upload,
  Activity,
  AlertCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

// Updated interfaces to match backend response
interface NetworkConnection {
  fd: number | null;
  family: string;
  type: string;
  local_addr: string;
  remote_addr: string;
  status: string;
  pid: number | null;
  process_name: string;
}

interface NetworkAdapter {
  name: string;
  is_up: boolean;
  speed: number;
  mtu: number;
  ip_addresses: string[];
  bytes_sent: number;
  bytes_recv: number;
}

interface NetworkIOCounters {
  bytes_sent: number;
  bytes_recv: number;
  packets_sent: number;
  packets_recv: number;
  errin: number;
  errout: number;
  dropin: number;
  dropout: number;
}

interface NetworkInfo {
  adapters: NetworkAdapter[];
  connections: NetworkConnection[];
  io_counters: NetworkIOCounters;
}

export default function NetworkPage() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8000/api/network/all');
        if (!res.ok) {
          throw new Error('Failed to fetch network information');
        }
        const data: NetworkInfo = await res.json();
        setNetworkInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkInfo();
    const interval = setInterval(fetchNetworkInfo, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredConnections = networkInfo?.connections.filter(conn =>
    conn.remote_addr.includes(searchTerm) ||
    conn.process_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStateColor = (state: string) => {
    switch (state) {
      case 'ESTABLISHED': return 'bg-green-500/20 text-green-400';
      case 'LISTEN': return 'bg-blue-500/20 text-blue-400';
      case 'TIME_WAIT': return 'bg-yellow-500/20 text-yellow-400';
      case 'CLOSE_WAIT': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getAdapterStatusColor = (isUp: boolean) => {
    return isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <AlertCircle className="w-8 h-8 mr-2" />
        <span>Error: {error}</span>
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
        <h1 className="text-3xl font-bold text-white mb-2">Network Monitor</h1>
        <p className="text-muted-foreground">
          Monitor network activity and connections with divine oversight
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <Download className="w-8 h-8 text-[var(--indra-blue)] mx-auto mb-3" />
            {loading ? <Skeleton className="h-8 w-24 mx-auto" /> : <div className="text-2xl font-bold text-white mb-1">{formatBytes(networkInfo?.io_counters.bytes_recv || 0)}</div>}
            <div className="text-sm text-muted-foreground">Total Received</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <Upload className="w-8 h-8 text-[var(--indra-red)] mx-auto mb-3" />
            {loading ? <Skeleton className="h-8 w-24 mx-auto" /> : <div className="text-2xl font-bold text-white mb-1">{formatBytes(networkInfo?.io_counters.bytes_sent || 0)}</div>}
            <div className="text-sm text-muted-foreground">Total Sent</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-[var(--indra-accent)] mx-auto mb-3" />
            {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : <div className="text-2xl font-bold text-white mb-1">{networkInfo?.connections.length || 0}</div>}
            <div className="text-sm text-muted-foreground">Active Connections</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <Router className="w-8 h-8 text-green-400 mx-auto mb-3" />
            {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : <div className="text-2xl font-bold text-white mb-1">{networkInfo?.adapters.length || 0}</div>}
            <div className="text-sm text-muted-foreground">Network Adapters</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Router className="w-5 h-5 text-[var(--indra-blue)]" />
              <span>Network Adapters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {loading ? (
              Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-24 w-full" />)
            ) : (
              networkInfo?.adapters.map((adapter, index) => (
                <motion.div
                  key={adapter.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-[var(--indra-dark)]/30 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-4 h-4 text-[var(--indra-accent)]" />
                      <span className="font-medium text-white">{adapter.name}</span>
                    </div>
                    <Badge className={getAdapterStatusColor(adapter.is_up)}>
                      {adapter.is_up ? 'Up' : 'Down'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">IP Address:</span>
                      <p className="text-white">{adapter.ip_addresses.join(', ') || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Speed:</span>
                      <p className="text-white">{adapter.speed} Mbps</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Received:</span>
                      <p className="text-white">{formatBytes(adapter.bytes_recv)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sent:</span>
                      <p className="text-white">{formatBytes(adapter.bytes_sent)}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <Globe className="w-5 h-5 text-[var(--indra-red)]" />
                <span>Active Connections</span>
              </CardTitle>
              <Input
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 bg-[var(--indra-dark)]/50 border-border/50"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-muted-foreground">Remote Address</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Process</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredConnections.map((connection, index) => (
                      <motion.tr
                        key={`${connection.local_addr}-${connection.remote_addr}-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="border-border/50 hover:bg-[var(--indra-dark)]/30"
                      >
                        <TableCell className="text-white font-mono text-sm">
                          {connection.remote_addr || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStateColor(connection.status)}>
                            {connection.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{connection.process_name}</TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
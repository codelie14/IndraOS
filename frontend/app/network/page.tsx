'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Wifi, 
  Globe, 
  Router, 
  Signal,
  Download,
  Upload,
  Activity,
  MapPin,
  Shield,
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

interface NetworkConnection {
  id: string;
  localAddress: string;
  remoteAddress: string;
  protocol: 'TCP' | 'UDP';
  state: 'ESTABLISHED' | 'LISTENING' | 'TIME_WAIT' | 'CLOSE_WAIT';
  process: string;
  port: number;
}

interface NetworkAdapter {
  name: string;
  type: 'Ethernet' | 'WiFi' | 'VPN';
  status: 'Connected' | 'Disconnected' | 'Limited';
  ipAddress: string;
  speed: string;
  bytesReceived: number;
  bytesSent: number;
}

export default function NetworkPage() {
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [adapters, setAdapters] = useState<NetworkAdapter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock network data
    const mockConnections: NetworkConnection[] = [
      {
        id: '1',
        localAddress: '192.168.1.100',
        remoteAddress: '142.250.191.14',
        protocol: 'TCP',
        state: 'ESTABLISHED',
        process: 'chrome.exe',
        port: 443
      },
      {
        id: '2',
        localAddress: '192.168.1.100',
        remoteAddress: '0.0.0.0',
        protocol: 'TCP',
        state: 'LISTENING',
        process: 'System',
        port: 80
      },
      {
        id: '3',
        localAddress: '192.168.1.100',
        remoteAddress: '52.97.144.85',
        protocol: 'TCP',
        state: 'ESTABLISHED',
        process: 'Teams.exe',
        port: 443
      }
    ];

    const mockAdapters: NetworkAdapter[] = [
      {
        name: 'Ethernet',
        type: 'Ethernet',
        status: 'Connected',
        ipAddress: '192.168.1.100',
        speed: '1 Gbps',
        bytesReceived: 1024000000,
        bytesSent: 512000000
      },
      {
        name: 'Wi-Fi',
        type: 'WiFi',
        status: 'Disconnected',
        ipAddress: '--',
        speed: '--',
        bytesReceived: 0,
        bytesSent: 0
      }
    ];

    setConnections(mockConnections);
    setAdapters(mockAdapters);
  }, []);

  const filteredConnections = connections.filter(conn =>
    conn.remoteAddress.includes(searchTerm) ||
    conn.process.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStateColor = (state: string) => {
    switch (state) {
      case 'ESTABLISHED': return 'bg-green-500/20 text-green-400';
      case 'LISTENING': return 'bg-blue-500/20 text-blue-400';
      case 'TIME_WAIT': return 'bg-yellow-500/20 text-yellow-400';
      case 'CLOSE_WAIT': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getAdapterStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'bg-green-500/20 text-green-400';
      case 'Limited': return 'bg-yellow-500/20 text-yellow-400';
      case 'Disconnected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
            <div className="text-2xl font-bold text-white mb-1">85.6</div>
            <div className="text-sm text-muted-foreground">Mbps Download</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <Upload className="w-8 h-8 text-[var(--indra-red)] mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">25.3</div>
            <div className="text-sm text-muted-foreground">Mbps Upload</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-[var(--indra-accent)] mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{connections.length}</div>
            <div className="text-sm text-muted-foreground">Active Connections</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <Signal className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">98%</div>
            <div className="text-sm text-muted-foreground">Signal Strength</div>
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
          <CardContent className="p-6 space-y-4">
            {adapters.map((adapter, index) => (
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
                  <Badge className={getAdapterStatusColor(adapter.status)}>
                    {adapter.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">IP Address:</span>
                    <p className="text-white">{adapter.ipAddress}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Speed:</span>
                    <p className="text-white">{adapter.speed}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Received:</span>
                    <p className="text-white">{formatBytes(adapter.bytesReceived)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sent:</span>
                    <p className="text-white">{formatBytes(adapter.bytesSent)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
                    <TableHead className="text-muted-foreground">Protocol</TableHead>
                    <TableHead className="text-muted-foreground">State</TableHead>
                    <TableHead className="text-muted-foreground">Process</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConnections.map((connection, index) => (
                    <motion.tr
                      key={connection.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="border-border/50 hover:bg-[var(--indra-dark)]/30"
                    >
                      <TableCell className="text-white font-mono text-sm">
                        {connection.remoteAddress}:{connection.port}
                      </TableCell>
                      <TableCell className="text-white">{connection.protocol}</TableCell>
                      <TableCell>
                        <Badge className={getStateColor(connection.state)}>
                          {connection.state}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{connection.process}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
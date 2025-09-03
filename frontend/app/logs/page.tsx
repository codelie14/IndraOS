'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Filter, 
  Download,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  Clock,
  Trash2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  details?: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  useEffect(() => {
    // Mock log data
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        level: 'info',
        source: 'System',
        message: 'System startup completed successfully',
        details: 'All core services initialized and running normally'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        level: 'warning',
        source: 'Security',
        message: 'Failed login attempt detected',
        details: 'Multiple failed authentication attempts from IP 192.168.1.50'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        level: 'error',
        source: 'Network',
        message: 'Connection timeout to external service',
        details: 'Unable to establish connection to api.example.com after 30 seconds'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        level: 'critical',
        source: 'Disk',
        message: 'Low disk space warning',
        details: 'System drive C: has less than 10% free space remaining'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1500000).toISOString(),
        level: 'info',
        source: 'Application',
        message: 'Service restart completed',
        details: 'Windows Audio service restarted successfully'
      }
    ];

    setLogs(mockLogs);
  }, []);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return Info;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'critical': return AlertCircle;
      default: return Info;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-500/20 text-blue-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'critical': return 'bg-red-600/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;
    
    return matchesSearch && matchesLevel && matchesSource;
  });

  const uniqueSources = Array.from(new Set(logs.map(log => log.source)));

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
        <p className="text-muted-foreground">
          Monitor system events and activities with divine insight
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <Info className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {logs.filter(l => l.level === 'info').length}
            </div>
            <div className="text-sm text-muted-foreground">Info Messages</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {logs.filter(l => l.level === 'warning').length}
            </div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {logs.filter(l => l.level === 'error').length}
            </div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-300 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {logs.filter(l => l.level === 'critical').length}
            </div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[var(--indra-surface)] border-border/50">
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[var(--indra-red)]" />
              <span>Event Logs ({filteredLogs.length})</span>
            </CardTitle>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[var(--indra-dark)]/50 border-border/50"
                />
              </div>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32 bg-[var(--indra-dark)]/50">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-32 bg-[var(--indra-dark)]/50">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Timestamp</TableHead>
                  <TableHead className="text-muted-foreground">Level</TableHead>
                  <TableHead className="text-muted-foreground">Source</TableHead>
                  <TableHead className="text-muted-foreground">Message</TableHead>
                  <TableHead className="text-muted-foreground">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log, index) => {
                  const Icon = getLevelIcon(log.level);
                  
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-border/50 hover:bg-[var(--indra-dark)]/30"
                    >
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <Badge className={getLevelColor(log.level)}>
                            {log.level}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{log.source}</TableCell>
                      <TableCell className="text-white max-w-xs truncate">{log.message}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {log.details || '--'}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Square, 
  Play, 
  Trash2,
  AlertTriangle
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSystemStore } from '@/store/useSystemStore';
import { systemAPI } from '@/lib/api';
import type { Process } from '@/types/system';

export default function ProcessesPage() {
  const { processes, setProcesses } = useSystemStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Process>('cpuUsage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const data = await systemAPI.getProcesses();
        setProcesses(data);
      } catch (error) {
        console.error('Failed to fetch processes:', error);
        // Mock data for development
        const mockProcesses: Process[] = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          name: `process_${i + 1}.exe`,
          cpuUsage: Math.random() * 100,
          memoryUsage: Math.random() * 1000,
          diskUsage: Math.random() * 50,
          status: ['running', 'sleeping', 'stopped'][Math.floor(Math.random() * 3)] as any,
          priority: ['low', 'normal', 'high', 'realtime'][Math.floor(Math.random() * 4)] as any,
          owner: ['System', 'Administrator', 'User'][Math.floor(Math.random() * 3)],
          startTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        }));
        setProcesses(mockProcesses);
      }
    };

    fetchProcesses();
    const interval = setInterval(fetchProcesses, 10000);
    return () => clearInterval(interval);
  }, [setProcesses]);

  const filteredProcesses = processes
    .filter(process => 
      process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.owner.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : 1;
      }
      return aVal < bVal ? -1 : 1;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400';
      case 'sleeping': return 'bg-yellow-500/20 text-yellow-400';
      case 'stopped': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'realtime': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'normal': return 'bg-blue-500/20 text-blue-400';
      case 'low': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Process Manager</h1>
        <p className="text-muted-foreground">
          Monitor and control system processes with divine authority
        </p>
      </div>

      <Card className="bg-[var(--indra-surface)] border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <CardTitle className="text-white">Active Processes ({filteredProcesses.length})</CardTitle>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search processes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[var(--indra-dark)]/50 border-border/50"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Process Name</TableHead>
                  <TableHead className="text-muted-foreground">CPU %</TableHead>
                  <TableHead className="text-muted-foreground">Memory</TableHead>
                  <TableHead className="text-muted-foreground">Disk I/O</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-muted-foreground">Owner</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.map((process, index) => (
                  <motion.tr
                    key={process.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="border-border/50 hover:bg-[var(--indra-dark)]/30"
                  >
                    <TableCell className="font-medium text-white">{process.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{process.cpuUsage.toFixed(1)}%</span>
                        {process.cpuUsage > 50 && (
                          <AlertTriangle className="w-3 h-3 text-yellow-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{process.memoryUsage.toFixed(1)} MB</TableCell>
                    <TableCell className="text-white">{process.diskUsage.toFixed(1)} MB/s</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(process.status)}>
                        {process.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(process.priority)}>
                        {process.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{process.owner}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Square className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Kill Process
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
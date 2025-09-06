'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2,
  AlertTriangle,
  RefreshCw
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useSystemStore } from '@/store/useSystemStore';
import { systemAPI } from '@/lib/api';
import type { Process } from '@/types/system';
import { useToast } from '@/hooks/use-toast';

export default function ProcessesPage() {
  const { processes, setProcesses } = useSystemStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof Process>('cpu_usage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProcesses = useCallback(async () => {
    try {
      setError(null);
      const data = await systemAPI.getProcesses(0, 1000); // Fetch more processes
      setProcesses(data);
    } catch (err) {
      console.error('Failed to fetch processes:', err);
      setError('Failed to load process data. Please try again later.');
      toast({
        title: 'Error',
        description: 'Could not fetch processes from the server.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [setProcesses, toast]);

  useEffect(() => {
    fetchProcesses();
    const interval = setInterval(fetchProcesses, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchProcesses]);

  const handleKillProcess = async (pid: number) => {
    try {
      await systemAPI.killProcess(pid);
      toast({
        title: 'Success',
        description: `Process ${pid} has been terminated.`,
      });
      // Refresh the list immediately
      fetchProcesses();
    } catch (error) {
      console.error(`Failed to kill process ${pid}:`, error);
      toast({
        title: 'Error',
        description: `Failed to terminate process ${pid}. It may require higher privileges.`,
        variant: 'destructive',
      });
    }
  };

  const filteredProcesses = processes
    .filter(process => {
      if (statusFilter === 'all') return true;
      return process.status === statusFilter;
    })
    .filter(process => 
      process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (process.owner && process.owner.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
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

  const processStatuses = ['all', ...Array.from(new Set(processes.map(p => p.status)))];

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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {processStatuses.map(status => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilter === status}
                      onCheckedChange={() => setStatusFilter(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="icon" onClick={() => fetchProcesses()} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">PID</TableHead>
                  <TableHead className="text-muted-foreground">Process Name</TableHead>
                  <TableHead className="text-muted-foreground">CPU %</TableHead>
                  <TableHead className="text-muted-foreground">Memory</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Owner</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">Loading processes...</p>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-red-400">{error}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProcesses.map((process, index) => (
                    <motion.tr
                      key={process.pid}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-border/50 hover:bg-[var(--indra-dark)]/30"
                    >
                      <TableCell className="text-muted-foreground">{process.pid}</TableCell>
                      <TableCell className="font-medium text-white">{process.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{process.cpu_usage?.toFixed(1) ?? '0.0'}%</span>
                          {process.cpu_usage && process.cpu_usage > 50 && (
                            <AlertTriangle className="w-3 h-3 text-yellow-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{process.memory_usage?.toFixed(1) ?? '0.0'} MB</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(process.status)}>
                          {process.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{process.owner || 'N/A'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="text-red-400"
                              onClick={() => handleKillProcess(process.pid)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Kill Process
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

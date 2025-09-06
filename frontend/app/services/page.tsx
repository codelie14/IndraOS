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
  Play, 
  Square, 
  RotateCcw,
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
} from '@/components/ui/dropdown-menu';
import { systemAPI } from '@/lib/api';
import type { Service } from '@/types/system';
import { useToast } from '@/hooks/use-toast';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    try {
      setError(null);
      const data = await systemAPI.getServices(0, 1000); // Fetch more services
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError('Failed to load service data. Please try again later.');
      toast({
        title: 'Error',
        description: 'Could not fetch services from the server.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [fetchServices]);

  const handleServiceAction = async (action: 'start' | 'stop' | 'restart', name: string) => {
    try {
      let response;
      if (action === 'start') {
        response = await systemAPI.startService(name);
      } else if (action === 'stop') {
        response = await systemAPI.stopService(name);
      } else {
        response = await systemAPI.restartService(name);
      }
      toast({
        title: 'Success',
        description: response.message || `Service ${name} action completed.`,
      });
      fetchServices(); // Refresh list after action
    } catch (error) {
      console.error(`Failed to ${action} service ${name}:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} service ${name}. It may require higher privileges.`,
        variant: 'destructive',
      });
    }
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400';
      case 'stopped': return 'bg-red-500/20 text-red-400';
      case 'starting': return 'bg-yellow-500/20 text-yellow-400';
      case 'stopping': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStartTypeColor = (start_type: string) => {
    switch (start_type) {
      case 'auto': return 'bg-blue-500/20 text-blue-400';
      case 'manual': return 'bg-purple-500/20 text-purple-400';
      case 'disabled': return 'bg-gray-500/20 text-gray-400';
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
        <h1 className="text-3xl font-bold text-white mb-2">Windows Services</h1>
        <p className="text-muted-foreground">
          Monitor and control Windows services with divine authority
        </p>
      </div>

      <Card className="bg-[var(--indra-surface)] border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <CardTitle className="text-white">System Services ({filteredServices.length})</CardTitle>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[var(--indra-dark)]/50 border-border/50"
                />
              </div>
              
              <Button variant="outline" size="icon" onClick={() => fetchServices()} disabled={loading}>
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
                  <TableHead className="text-muted-foreground">Service Name</TableHead>
                  <TableHead className="text-muted-foreground">Display Name</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Start Type</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">Loading services...</p>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-red-400">{error}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service, index) => (
                    <motion.tr
                      key={service.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-border/50 hover:bg-[var(--indra-dark)]/30"
                    >
                      <TableCell className="font-medium text-white">{service.name}</TableCell>
                      <TableCell className="text-white">{service.display_name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStartTypeColor(service.start_type)}>
                          {service.start_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {service.status === 'running' ? (
                              <DropdownMenuItem onClick={() => handleServiceAction('stop', service.name)}>
                                <Square className="w-4 h-4 mr-2" />
                                Stop
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleServiceAction('start', service.name)}>
                                <Play className="w-4 h-4 mr-2" />
                                Start
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleServiceAction('restart', service.name)}>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Restart
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

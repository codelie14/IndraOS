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
  Play, 
  Square, 
  RotateCcw,
  Settings2
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

interface Service {
  id: string;
  name: string;
  displayName: string;
  status: 'running' | 'stopped' | 'starting' | 'stopping';
  startType: 'automatic' | 'manual' | 'disabled';
  description: string;
  dependencies: string[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock services data for development
    const mockServices: Service[] = [
      {
        id: 'audio',
        name: 'AudioSrv',
        displayName: 'Windows Audio',
        status: 'running',
        startType: 'automatic',
        description: 'Manages audio for Windows-based programs',
        dependencies: ['AudioEndpointBuilder', 'RpcSs']
      },
      {
        id: 'defender',
        name: 'WinDefend',
        displayName: 'Windows Defender Antivirus Service',
        status: 'running',
        startType: 'automatic',
        description: 'Helps protect users from malware and other potentially unwanted software',
        dependencies: ['RpcSs', 'WinMgmt']
      },
      {
        id: 'update',
        name: 'wuauserv',
        displayName: 'Windows Update',
        status: 'stopped',
        startType: 'manual',
        description: 'Enables the download and installation of Windows updates',
        dependencies: ['RpcSs']
      },
      {
        id: 'firewall',
        name: 'MpsSvc',
        displayName: 'Windows Defender Firewall',
        status: 'running',
        startType: 'automatic',
        description: 'Helps protect your computer by preventing unauthorized users from gaining access',
        dependencies: ['BFE', 'RpcSs']
      },
      {
        id: 'print',
        name: 'Spooler',
        displayName: 'Print Spooler',
        status: 'running',
        startType: 'automatic',
        description: 'Loads files to memory for later printing',
        dependencies: ['RPCSS', 'http']
      }
    ];

    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.displayName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getStartTypeColor = (startType: string) => {
    switch (startType) {
      case 'automatic': return 'bg-blue-500/20 text-blue-400';
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
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">
              <div className="w-8 h-8 border-2 border-[var(--indra-red)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Service Name</TableHead>
                    <TableHead className="text-muted-foreground">Display Name</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Start Type</TableHead>
                    <TableHead className="text-muted-foreground">Description</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service, index) => (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-border/50 hover:bg-[var(--indra-dark)]/30"
                    >
                      <TableCell className="font-medium text-white">{service.name}</TableCell>
                      <TableCell className="text-white">{service.displayName}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStartTypeColor(service.startType)}>
                          {service.startType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {service.description}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {service.status === 'running' ? (
                              <DropdownMenuItem>
                                <Square className="w-4 h-4 mr-2" />
                                Stop Service
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Play className="w-4 h-4 mr-2" />
                                Start Service
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Restart Service
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings2 className="w-4 h-4 mr-2" />
                              Properties
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
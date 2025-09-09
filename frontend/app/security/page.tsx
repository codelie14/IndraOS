'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Scan,
  Lock,
  Eye,
  Zap,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast"

// Interfaces to match backend response
interface SecurityEvent {
  id: number;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  resolved: boolean;
  source: string;
  ip_address: string | null;
}

interface SecurityStats {
  total_events: number;
  unresolved_events: number;
  events_by_severity: Record<string, number>;
}

export default function SecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [eventsRes, statsRes] = await Promise.all([
        fetch('http://localhost:8000/api/security/events?limit=100'),
        fetch('http://localhost:8000/api/security/stats')
      ]);

      if (!eventsRes.ok) throw new Error('Failed to fetch security events');
      if (!statsRes.ok) throw new Error('Failed to fetch security stats');

      const eventsData = await eventsRes.json();
      const statsData = await statsRes.json();

      setEvents(eventsData.events);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const runSecurityScan = async () => {
    setScanning(true);
    toast({ title: "Security Scan Started", description: "The system is being scanned for threats." });
    try {
      const res = await fetch('http://localhost:8000/api/security/scan', { method: 'POST' });
      if (!res.ok) throw new Error('Scan failed');
      const result = await res.json();
      toast({
        title: "Scan Complete",
        description: `${result.events_found} new potential threats found.`,
      });
      fetchData(); // Refresh data after scan
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Scan Error",
        description: err instanceof Error ? err.message : 'An unknown error occurred during the scan.',
      });
    } finally {
      setScanning(false);
    }
  };

  const handleResolveEvent = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/security/events/${id}/resolve`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to resolve event');
      toast({ title: "Event Resolved", description: `Event #${id} has been marked as resolved.` });
      fetchData();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : 'Could not resolve event.' });
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/security/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      toast({ title: "Event Deleted", description: `Event #${id} has been deleted.` });
      fetchData();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : 'Could not delete event.' });
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const severityMatch = severityFilter === 'all' || event.severity === severityFilter;
      const statusMatch = statusFilter === 'all' || (statusFilter === 'resolved' ? event.resolved : !event.resolved);
      return severityMatch && statusMatch;
    });
  }, [events, severityFilter, statusFilter]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return <div className="p-6"><Skeleton className="h-screen w-full" /></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500"><AlertTriangle className="w-8 h-8 mr-2" /><span>Error: {error}</span></div>;
  }

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Security Center</h1>
        <p className="text-muted-foreground">
          Comprehensive security monitoring with Indra's divine protection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.total_events || 0}</div>
            <p className="text-xs text-muted-foreground">Total security events recorded</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unresolved Threats</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats?.unresolved_events || 0}</div>
            <p className="text-xs text-muted-foreground">Active threats requiring attention</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Threats</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{stats?.events_by_severity?.critical || 0}</div>
            <p className="text-xs text-muted-foreground">High-impact threats detected</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Firewall Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">Active</div>
            <p className="text-xs text-muted-foreground">System firewall is enabled</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[var(--indra-surface)] border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-[var(--indra-red)]" />
              <span>Security Threats</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-36 bg-[var(--indra-dark)]/50 border-border/50">
                  <SelectValue placeholder="By Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 bg-[var(--indra-dark)]/50 border-border/50">
                  <SelectValue placeholder="By Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={runSecurityScan}
                disabled={scanning}
                className="bg-[var(--indra-red)] hover:bg-[var(--indra-red)]/80"
              >
                {scanning ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scanning...</span>
                  </div>
                ) : (
                  <><Scan className="w-4 h-4 mr-2" />Full Scan</>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p className="text-white font-medium">No threats match your filters</p>
              <p className="text-muted-foreground text-sm">Your system is secure under divine protection</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 bg-[var(--indra-dark)]/30 rounded-lg border ${getSeverityColor(event.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white">{event.event_type.replace(/_/g, ' ')}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                      <Badge className={event.resolved ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {event.resolved ? 'Resolved' : 'Unresolved'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()} - Source: {event.source} {event.ip_address && `(${event.ip_address})`}
                    </span>
                    <div className="flex space-x-2">
                      {!event.resolved && (
                        <Button size="sm" variant="outline" onClick={() => handleResolveEvent(event.id)}>
                          <ShieldCheck className="w-4 h-4 mr-2" /> Mark as Resolved
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
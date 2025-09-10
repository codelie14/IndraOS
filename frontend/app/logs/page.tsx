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
import { systemAPI } from '@/lib/api';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  details?: string;
}

export default function LogsPage() {
  const PAGE_SIZE = 200;
  const [logs, setLogs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = async (append = false) => {
    setLoading(true);
    try {
      const data = await systemAPI.getSystemLogs(PAGE_SIZE, skip);
      if (append) {
        setLogs(prev => [...prev, ...(data.logs || [])]);
      } else {
        setLogs(data.logs || []);
      }
      setTotal(data.total || 0);
      setHasMore((skip + PAGE_SIZE) < (data.total || 0));
      setError(data.message || null);
    } catch (err) {
      setError('Erreur lors du chargement des logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSkip(0);
    fetchLogs(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    const newSkip = skip + PAGE_SIZE;
    setSkip(newSkip);
    setLoading(true);
    systemAPI.getSystemLogs(PAGE_SIZE, newSkip)
      .then((data) => {
        setLogs(prev => [...prev, ...(data.logs || [])]);
        setTotal(data.total || 0);
        setHasMore((newSkip + PAGE_SIZE) < (data.total || 0));
        setError(data.message || null);
      })
      .catch(() => setError('Erreur lors du chargement des logs.'))
      .finally(() => setLoading(false));
  };

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

  const filteredLogs = logs.filter(line => line.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
        <p className="text-muted-foreground">Affichage des logs système bruts (indraos.log)</p>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Rechercher dans les logs..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-[var(--indra-dark)]/50 border-border/50"
        />
        {loading && <span className="text-muted-foreground">Chargement...</span>}
        {error && <span className="text-red-500">{error}</span>}
      </div>
      <Card className="bg-[var(--indra-surface)] border-border/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[var(--indra-red)]" />
            <span>Logs ({filteredLogs.length} / {total})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[60vh]">
            <Table>
              <TableBody>
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell className="text-muted-foreground">Aucun log à afficher.</TableCell>
                  </TableRow>
                )}
                {filteredLogs.map((line, idx) => (
                  <TableRow key={idx} className="border-border/50 hover:bg-[var(--indra-dark)]/30">
                    <TableCell className="font-mono text-xs text-white whitespace-pre-wrap">{line}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {hasMore && (
            <div className="flex justify-center my-4">
              <Button onClick={handleLoadMore} disabled={loading} variant="outline">
                {loading ? 'Chargement...' : 'Charger plus'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
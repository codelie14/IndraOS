'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Scan,
  Lock,
  Eye,
  Zap,
  FileX,
  Globe,
  UserX
} from 'lucide-react';

interface SecurityThreat {
  id: string;
  type: 'malware' | 'suspicious' | 'vulnerability' | 'breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'detected' | 'quarantined' | 'resolved';
}

interface SecurityMetric {
  label: string;
  value: number;
  status: 'good' | 'warning' | 'danger';
  icon: React.ComponentType<{ className?: string }>;
}

export default function SecurityPage() {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const securityMetrics: SecurityMetric[] = [
    { label: 'Firewall Status', value: 100, status: 'good', icon: Shield },
    { label: 'Antivirus Protection', value: 98, status: 'good', icon: Lock },
    { label: 'Real-time Monitoring', value: 95, status: 'good', icon: Eye },
    { label: 'System Vulnerabilities', value: 15, status: 'warning', icon: AlertTriangle },
  ];

  useEffect(() => {
    // Mock threats data
    const mockThreats: SecurityThreat[] = [
      {
        id: '1',
        type: 'suspicious',
        severity: 'medium',
        title: 'Suspicious Network Activity',
        description: 'Unusual outbound connections detected from unknown process',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'detected'
      },
      {
        id: '2',
        type: 'vulnerability',
        severity: 'high',
        title: 'Outdated Security Patch',
        description: 'Critical Windows security update available',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'detected'
      }
    ];
    setThreats(mockThreats);
    setLastScan(new Date(Date.now() - 1800000)); // 30 minutes ago
  }, []);

  const runSecurityScan = async () => {
    setScanning(true);
    // Simulate scan duration
    await new Promise(resolve => setTimeout(resolve, 3000));
    setLastScan(new Date());
    setScanning(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'quarantined': return 'bg-blue-500/20 text-blue-400';
      case 'detected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'danger': return 'text-red-400';
      default: return 'text-gray-400';
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
        <h1 className="text-3xl font-bold text-white mb-2">Security Center</h1>
        <p className="text-muted-foreground">
          Comprehensive security monitoring with Indra's divine protection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-[var(--indra-surface)] border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-6 h-6 ${getMetricColor(metric.status)}`} />
                    <Badge className={`${getMetricColor(metric.status)} bg-transparent border-current`}>
                      {metric.value}%
                    </Badge>
                  </div>
                  <h3 className="font-medium text-white mb-2">{metric.label}</h3>
                  <Progress value={metric.value} className="h-2" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card className="bg-[var(--indra-surface)] border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-[var(--indra-red)]" />
                  <span>Security Threats</span>
                </CardTitle>
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
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Full Scan
                    </>
                  )}
                </Button>
              </div>
              {lastScan && (
                <p className="text-sm text-muted-foreground">
                  Last scan: {lastScan.toLocaleString()}
                </p>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {threats.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <p className="text-white font-medium">No threats detected</p>
                  <p className="text-muted-foreground text-sm">Your system is secure under divine protection</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {threats.map((threat, index) => (
                    <motion.div
                      key={threat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-[var(--indra-dark)]/30 rounded-lg border border-border/30"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white">{threat.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                          <Badge className={getStatusColor(threat.status)}>
                            {threat.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{threat.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(threat.timestamp).toLocaleString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Quarantine</Button>
                          <Button size="sm" variant="outline">Resolve</Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[var(--indra-blue)]" />
              <span>Protection Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[var(--indra-dark)]/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Windows Defender</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--indra-dark)]/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Firewall</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--indra-dark)]/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Real-time Protection</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400">On</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--indra-dark)]/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white">Network Protection</span>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400">Partial</Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border/30">
              <Button className="w-full bg-[var(--indra-red)] hover:bg-[var(--indra-red)]/80">
                <Zap className="w-4 h-4 mr-2" />
                Enhance Protection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
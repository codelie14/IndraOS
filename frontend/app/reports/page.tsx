'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Calendar,
  Clock,
  TrendingUp,
  PieChart,
  Activity,
  Shield,
  Cpu,
  HardDrive
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Report {
  id: string;
  name: string;
  type: 'performance' | 'security' | 'system' | 'custom';
  format: 'pdf' | 'csv' | 'json';
  createdAt: string;
  size: string;
  status: 'ready' | 'generating' | 'failed';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  metrics: string[];
  estimatedTime: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [reportFormat, setReportFormat] = useState<string>('pdf');
  const [reportType, setReportType] = useState<string>('performance');
  const [generating, setGenerating] = useState(false);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'performance',
      name: 'Performance Analysis',
      description: 'Comprehensive system performance metrics and trends',
      icon: TrendingUp,
      metrics: ['CPU Usage', 'Memory Usage', 'Disk I/O', 'Network Activity'],
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'security',
      name: 'Security Assessment',
      description: 'Security threats, vulnerabilities, and protection status',
      icon: Shield,
      metrics: ['Threat Detection', 'Firewall Status', 'Antivirus Scans', 'Security Events'],
      estimatedTime: '3-5 minutes'
    },
    {
      id: 'system',
      name: 'System Overview',
      description: 'Complete system information and health status',
      icon: Activity,
      metrics: ['Hardware Info', 'System Health', 'Service Status', 'Process List'],
      estimatedTime: '1-2 minutes'
    },
    {
      id: 'custom',
      name: 'Custom Report',
      description: 'Build your own report with selected metrics',
      icon: PieChart,
      metrics: [],
      estimatedTime: 'Variable'
    }
  ];

  const availableMetrics = [
    'CPU Performance',
    'Memory Usage',
    'Disk Activity',
    'Network Traffic',
    'Security Events',
    'Process Activity',
    'Service Status',
    'System Health',
    'AI Insights',
    'Error Logs'
  ];

  useEffect(() => {
    // Mock existing reports
    const mockReports: Report[] = [
      {
        id: '1',
        name: 'Daily Performance Report',
        type: 'performance',
        format: 'pdf',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        size: '2.4 MB',
        status: 'ready'
      },
      {
        id: '2',
        name: 'Security Assessment',
        type: 'security',
        format: 'pdf',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        size: '1.8 MB',
        status: 'ready'
      },
      {
        id: '3',
        name: 'Weekly System Overview',
        type: 'system',
        format: 'csv',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        size: '856 KB',
        status: 'ready'
      }
    ];
    setReports(mockReports);
  }, []);

  const generateReport = async () => {
    setGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newReport: Report = {
      id: Date.now().toString(),
      name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      type: reportType as any,
      format: reportFormat as any,
      createdAt: new Date().toISOString(),
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      status: 'ready'
    };
    
    setReports(prev => [newReport, ...prev]);
    setGenerating(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-blue-500/20 text-blue-400';
      case 'security': return 'bg-red-500/20 text-red-400';
      case 'system': return 'bg-green-500/20 text-green-400';
      case 'custom': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500/20 text-green-400';
      case 'generating': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
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
        <h1 className="text-3xl font-bold text-white mb-2">Divine Reports</h1>
        <p className="text-muted-foreground">
          Generate comprehensive system reports with AI-powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card className="bg-[var(--indra-surface)] border-border/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[var(--indra-red)]" />
                <span>Report Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template, index) => {
                  const Icon = template.icon;
                  
                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                        reportType === template.id 
                          ? 'border-[var(--indra-red)] bg-[var(--indra-red)]/10' 
                          : 'border-border/30 hover:border-[var(--indra-red)]/50'
                      }`}
                      onClick={() => setReportType(template.id)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 rounded-lg bg-[var(--indra-red)]/20">
                          <Icon className="w-5 h-5 text-[var(--indra-red)]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{template.name}</h3>
                          <p className="text-xs text-muted-foreground">{template.estimatedTime}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      {template.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {template.metrics.map(metric => (
                            <Badge key={metric} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {reportType === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-[var(--indra-dark)]/30 rounded-lg"
                >
                  <h4 className="font-medium text-white mb-3">Select Metrics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {availableMetrics.map(metric => (
                      <div key={metric} className="flex items-center space-x-2">
                        <Checkbox
                          id={metric}
                          checked={selectedMetrics.includes(metric)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMetrics(prev => [...prev, metric]);
                            } else {
                              setSelectedMetrics(prev => prev.filter(m => m !== metric));
                            }
                          }}
                        />
                        <label htmlFor={metric} className="text-sm text-white cursor-pointer">
                          {metric}
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger className="w-32 bg-[var(--indra-dark)]/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateReport}
                  disabled={generating}
                  className="bg-[var(--indra-red)] hover:bg-[var(--indra-red)]/80"
                >
                  {generating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[var(--indra-blue)]" />
              <span>Recent Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-[var(--indra-dark)]/30 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white text-sm">{report.name}</h4>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                    <Badge className={getTypeColor(report.type)}>
                      {report.type}
                    </Badge>
                    <span>{report.format.toUpperCase()}</span>
                    <span>{report.size}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    {report.status === 'ready' && (
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {reports.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No reports generated yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
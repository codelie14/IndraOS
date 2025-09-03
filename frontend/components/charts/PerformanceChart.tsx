'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Line, Doughnut, Radar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { INDRA_COLORS } from '@/lib/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

interface PerformanceChartProps {
  data?: {
    cpu: number[];
    memory: number[];
    disk: number[];
    network: number[];
  };
  labels?: string[];
}

export function PerformanceChart({ data, labels }: PerformanceChartProps) {
  const [chartData, setChartData] = useState({
    cpu: [],
    memory: [],
    disk: [],
    network: [],
  });

  const [currentLabels, setCurrentLabels] = useState<string[]>([]);

  // Initialize data on client side only
  useEffect(() => {
    const initialData = {
      cpu: Array.from({ length: 20 }, () => Math.random() * 100),
      memory: Array.from({ length: 20 }, () => Math.random() * 100),
      disk: Array.from({ length: 20 }, () => Math.random() * 100),
      network: Array.from({ length: 20 }, () => Math.random() * 100),
    };

    const initialLabels = Array.from({ length: 20 }, (_, i) => {
      const now = new Date();
      now.setSeconds(now.getSeconds() - (19 - i) * 5);
      return now.toLocaleTimeString();
    });

    setChartData(initialData);
    setCurrentLabels(initialLabels);
  }, []);

  useEffect(() => {
    if (chartData.cpu.length === 0) return; // Wait for initial data

    const interval = setInterval(() => {
      setChartData(prev => ({
        cpu: [...prev.cpu.slice(1), Math.random() * 100],
        memory: [...prev.memory.slice(1), Math.random() * 100],
        disk: [...prev.disk.slice(1), Math.random() * 100],
        network: [...prev.network.slice(1), Math.random() * 100],
      }));

      setCurrentLabels(prev => {
        const newLabel = new Date().toLocaleTimeString();
        return [...prev.slice(1), newLabel];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [chartData.cpu.length]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: INDRA_COLORS.surface,
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: INDRA_COLORS.primary,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          maxTicksLimit: 5,
        },
      },
      y: {
        display: true,
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          callback: (value: any) => `${value}%`,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
  };

  const lineChartData = {
    labels: labels || currentLabels,
    datasets: [
      {
        data: data?.cpu || chartData.cpu,
        borderColor: INDRA_COLORS.primary,
        backgroundColor: `${INDRA_COLORS.primary}20`,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ['CPU', 'Memory', 'Disk', 'Network'],
    datasets: [
      {
        data: [
          data?.cpu?.[data.cpu.length - 1] || chartData.cpu[chartData.cpu.length - 1] || 0,
          data?.memory?.[data.memory.length - 1] || chartData.memory[chartData.memory.length - 1] || 0,
          data?.disk?.[data.disk.length - 1] || chartData.disk[chartData.disk.length - 1] || 0,
          data?.network?.[data.network.length - 1] || chartData.network[chartData.network.length - 1] || 0,
        ],
        backgroundColor: [
          INDRA_COLORS.primary,
          INDRA_COLORS.secondary,
          INDRA_COLORS.accent,
          INDRA_COLORS.success,
        ],
        borderColor: [
          INDRA_COLORS.primary,
          INDRA_COLORS.secondary,
          INDRA_COLORS.accent,
          INDRA_COLORS.success,
        ],
        borderWidth: 2,
      },
    ],
  };

  const radarData = {
    labels: ['CPU', 'Memory', 'Disk I/O', 'Network', 'Temperature', 'Security'],
    datasets: [
      {
        label: 'System Health',
        data: [75, 85, 60, 90, 70, 95],
        backgroundColor: `${INDRA_COLORS.primary}30`,
        borderColor: INDRA_COLORS.primary,
        borderWidth: 2,
        pointBackgroundColor: INDRA_COLORS.primary,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false,
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
        },
        angleLines: {
          color: 'rgba(148, 163, 184, 0.3)',
        },
        pointLabels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <Card className="bg-[var(--indra-surface)] border-border/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <span>Performance Analytics</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[var(--indra-dark)]">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="health">Health Score</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-6">
            {chartData.cpu.length > 0 ? (
              <div className="h-64">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Loading chart data...
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="distribution" className="mt-6">
            {chartData.cpu.length > 0 ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-64">
                  <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Loading chart data...
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="health" className="mt-6">
            <div className="h-64">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
'use client';

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
  Filler,
} from 'chart.js';
import { Line, Doughnut, Radar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { INDRA_COLORS } from '@/lib/constants';
import { useSystemStore } from '@/store/useSystemStore';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

export function PerformanceChart() {
  const metricsHistory = useSystemStore((state) => state.metricsHistory);
  const latestMetrics = useSystemStore((state) => state.metrics);

  const chartData = useMemo(() => {
    const labels = metricsHistory.map((m) => new Date(m.timestamp).toLocaleTimeString());
    const cpu = metricsHistory.map((m) => m.cpu_usage);
    const memory = metricsHistory.map((m) => m.memory_usage);
    const disk = metricsHistory.map((m) => m.disk_usage);
    const network = metricsHistory.map((m) => m.network_in); // Using network_in for the chart

    return { labels, cpu, memory, disk, network };
  }, [metricsHistory]);

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
          maxTicksLimit: 10,
          autoSkip: true,
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

  const getLineChartData = (data: number[], color: string) => ({
    labels: chartData.labels,
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        fill: true,
      },
    ],
  });

  const doughnutData = {
    labels: ['CPU', 'Memory', 'Disk'],
    datasets: [
      {
        data: [
          latestMetrics?.cpu_usage || 0,
          latestMetrics?.memory_usage || 0,
          latestMetrics?.disk_usage || 0,
        ],
        backgroundColor: [
          INDRA_COLORS.primary,
          INDRA_COLORS.accent,
          INDRA_COLORS.success,
        ],
        borderColor: INDRA_COLORS.surface,
        borderWidth: 4,
      },
    ],
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          boxWidth: 12,
          padding: 20,
        }
      }
    }
  };

  const radarData = {
    labels: ['CPU', 'Memory', 'Disk I/O', 'Network', 'Uptime', 'Stability'],
    datasets: [
      {
        label: 'System Health',
        data: [
          100 - (latestMetrics?.cpu_usage || 0),
          100 - (latestMetrics?.memory_usage || 0),
          100 - (latestMetrics?.disk_usage || 0),
          Math.max(0, 100 - ((latestMetrics?.network_in || 0) * 10)), // Arbitrary scaling for network
          Math.min(100, (latestMetrics?.uptime || 0) / (3600 * 24) * 100), // % of a day
          latestMetrics?.system_status === 'operational' ? 95 : 10,
        ],
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
        <Tabs defaultValue="cpu" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[var(--indra-dark)]">
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="disk">Disk</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>
          
          {metricsHistory.length > 0 ? (
            <>
              <TabsContent value="cpu" className="mt-6">
                <div className="h-64">
                  <Line data={getLineChartData(chartData.cpu, INDRA_COLORS.primary)} options={lineChartOptions} />
                </div>
              </TabsContent>
              <TabsContent value="memory" className="mt-6">
                <div className="h-64">
                  <Line data={getLineChartData(chartData.memory, INDRA_COLORS.accent)} options={lineChartOptions} />
                </div>
              </TabsContent>
              <TabsContent value="disk" className="mt-6">
                <div className="h-64">
                  <Line data={getLineChartData(chartData.disk, INDRA_COLORS.success)} options={lineChartOptions} />
                </div>
              </TabsContent>
              <TabsContent value="health" className="mt-6">
                <div className="h-64 grid grid-cols-2 gap-4 items-center">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                    <Radar data={radarData} options={radarOptions} />
                </div>
              </TabsContent>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Waiting for performance data...
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

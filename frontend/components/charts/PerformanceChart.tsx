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
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
import type { SystemMetrics } from '@/types/system';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceChartProps {
  title: string;
  metricKey: keyof SystemMetrics;
  data: SystemMetrics[];
  color: string;
  unit?: string;
}

export function PerformanceChart({ title, metricKey, data = [], color, unit = '' }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    const labels = data.map((m) => new Date(m.timestamp).toLocaleTimeString());
    const values = data.map((m) => m[metricKey] as number);
    return { labels, values };
  }, [data, metricKey]);

  const latestValue = chartData.values.length > 0 ? chartData.values[chartData.values.length - 1] : 0;

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
        backgroundColor: 'hsl(var(--background))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: color,
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
          color: 'hsl(var(--muted-foreground))',
          maxTicksLimit: 8,
          autoSkip: true,
        },
      },
      y: {
        display: true,
        min: 0,
        // max: 100, // Removed for dynamic range
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          callback: (value: any) => `${value}${unit}`,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hoverRadius: 5,
        hitRadius: 10,
      },
    },
  };

  const lineChartData = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.values,
        borderColor: color,
        backgroundColor: `${color}33`, // 20% opacity
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <Card className="bg-[var(--indra-surface)] border-border/50 h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-base font-medium">{title}</CardTitle>
          <div className="text-2xl font-bold" style={{ color }}>
            {typeof latestValue === 'number' ? latestValue.toFixed(1) : '0.0'}{unit}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        {data.length > 1 ? (
          <div className="h-56">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        ) : (
          <div className="h-56 flex items-center justify-center text-muted-foreground">
            {data.length === 1 ? 'Need more data to draw a chart.' : 'Waiting for performance data...'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

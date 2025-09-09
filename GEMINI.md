## Error Type
Runtime TypeError

## Error Message
Cannot read properties of undefined (reading 'map')


    at PerformanceChart.useMemo[chartData] (components\charts\PerformanceChart.tsx:40:25)
    at PerformanceChart (components\charts\PerformanceChart.tsx:39:28)
    at DashboardPage (app\dashboard\page.tsx:57:11)

## Code Frame
  38 | export function PerformanceChart({ title, metricKey, data, color, unit = '' }: PerformanceChartProps) {
  39 |   const chartData = useMemo(() => {
> 40 |     const labels = data.map((m) => new Date(m.timestamp).toLocaleTimeString());
     |                         ^
  41 |     const values = data.map((m) => m[metricKey] as number);
  42 |     return { labels, values };
  43 |   }, [data, metricKey]);

Next.js version: 15.5.2 (Webpack)

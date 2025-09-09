'use client';

import { motion } from 'framer-motion';
import { SystemOverview } from '@/components/dashboard/SystemOverview';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { useSystemStore } from '@/store/useSystemStore';

export default function PerformancePage() {
  const metricsHistory = useSystemStore((state) => state.metricsHistory);

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Performance Monitor</h1>
        <p className="text-muted-foreground">
          Real-time system performance with divine precision
        </p>
      </div>

      <SystemOverview />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PerformanceChart
          title="CPU Temperature"
          metricKey="cpu_temperature"
          data={metricsHistory}
          color="#ff7f50"
          unit="°C"
        />
        <PerformanceChart
          title="Disk Usage"
          metricKey="disk_usage"
          data={metricsHistory}
          color="#90ee90"
          unit="%"
        />
      </div>
    </motion.div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { SystemOverview } from '@/components/dashboard/SystemOverview';
import { PerformanceChart } from '@/components/charts/PerformanceChart';

export default function PerformancePage() {
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
        <PerformanceChart />
        <PerformanceChart />
      </div>
    </motion.div>
  );
}
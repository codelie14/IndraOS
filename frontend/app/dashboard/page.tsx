'use client';

import { motion } from 'framer-motion';
import { SystemOverview } from '@/components/dashboard/SystemOverview';
import { BackendStatus } from '@/components/dashboard/BackendStatus';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { QuickActions } from '@/components/dashboard/QuickActions';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function DashboardPage() {
  return (
    <motion.div
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Divine Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your system with the wisdom of Indra, king of the gods
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <BackendStatus />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SystemOverview />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <PerformanceChart />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SystemHealth score={87} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <QuickActions />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AIInsightsPanel />
        </motion.div>
      </div>
    </motion.div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: LucideIcon;
  color?: 'default' | 'success' | 'warning' | 'danger';
  loading?: boolean;
  className?: string;
}

const colorVariants = {
  default: 'from-[var(--indra-red)] to-[var(--indra-blue)]',
  success: 'from-green-500 to-emerald-600',
  warning: 'from-yellow-500 to-orange-600',
  danger: 'from-red-500 to-rose-600',
};

export function MetricCard({
  title,
  value,
  unit,
  percentage,
  trend = 'stable',
  icon: Icon,
  color = 'default',
  loading = false,
  className,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group cursor-pointer", className)}
    >
      <Card className="bg-[var(--indra-surface)] border-border/50 hover:border-[var(--indra-red)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--indra-red)]/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "p-3 rounded-lg bg-gradient-to-br",
              colorVariants[color]
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            {trend !== 'stable' && (
              <div className={cn(
                "flex items-center text-xs px-2 py-1 rounded-full",
                trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full mr-1",
                  trend === 'up' ? 'bg-green-400' : 'bg-red-400'
                )} />
                {trend === 'up' ? '↗' : '↘'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            
            {loading ? (
              <div className="space-y-2">
                <div className="h-8 bg-muted/20 rounded animate-pulse" />
                {percentage !== undefined && (
                  <div className="h-2 bg-muted/20 rounded animate-pulse" />
                )}
              </div>
            ) : (
              <>
                <div className="flex items-baseline space-x-1">
                  <motion.span 
                    className="text-2xl font-bold text-white"
                    key={value}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {value}
                  </motion.span>
                  {unit && (
                    <span className="text-sm text-muted-foreground">{unit}</span>
                  )}
                </div>
                
                {percentage !== undefined && (
                  <div className="space-y-1">
                    <Progress 
                      value={percentage} 
                      className="h-2 bg-muted/20"
                    />
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% utilization
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
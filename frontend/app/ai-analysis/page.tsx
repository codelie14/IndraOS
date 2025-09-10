'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Shield, TrendingUp, Lightbulb } from 'lucide-react';
import { systemAPI } from '@/lib/api';
import { AIAnalysisData } from '@/types/system';
import { Skeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => systemAPI.getAIAnalysis();

export default function AIAnalysisPage() {
  const { data, error } = useSWR<AIAnalysisData>('/ai-analysis', fetcher);

  const isLoading = !data && !error;

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">AI Divine Analysis</h1>
        <p className="text-muted-foreground">
          Harness the wisdom of artificial intelligence with Indra's blessing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : data ? (
          <>
            <Card className="bg-[var(--indra-surface)] border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--indra-red)] to-pink-500 flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{data.stats.insights_generated}</div>
                <div className="text-sm text-muted-foreground">AI Insights Generated</div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--indra-surface)] border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{data.stats.optimizations_applied}</div>
                <div className="text-sm text-muted-foreground">Optimizations Applied</div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--indra-surface)] border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-[var(--indra-blue)] flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{data.stats.security_issues_fixed}</div>
                <div className="text-sm text-muted-foreground">Security Issues Fixed</div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--indra-surface)] border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">+{data.stats.performance_gain_percentage}%</div>
                <div className="text-sm text-muted-foreground">Performance Gain</div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {isLoading ? <Skeleton className="h-96" /> : data ? <AIInsightsPanel insights={data.insights} /> : <p>No insights available.</p>}
        </div>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-[var(--indra-accent)]" />
              <span>AI Analysis Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
              </div>
            ) : data ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">System Scan</span>
                    <span className="text-white">{data.status.system_scan_progress}%</span>
                  </div>
                  <Progress value={data.status.system_scan_progress} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Security Analysis</span>
                    <span className="text-white">{data.status.security_analysis_progress}%</span>
                  </div>
                  <Progress value={data.status.security_analysis_progress} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Performance Check</span>
                    <span className="text-white">{data.status.performance_check_progress}%</span>
                  </div>
                  <Progress value={data.status.performance_check_progress} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Optimization Scan</span>
                    <span className="text-white">{data.status.optimization_scan_progress}%</span>
                  </div>
                  <Progress value={data.status.optimization_scan_progress} className="h-2" />
                </div>
              </div>
            ) : null}

            <div className="p-4 bg-[var(--indra-dark)]/30 rounded-lg">
              <p className="text-sm text-[var(--indra-red)] font-medium mb-2">AI Status</p>
              <div className="text-xs text-muted-foreground">
                {isLoading ? <Skeleton className="h-4 w-3/4" /> : data ? data.status.status_message : 'Status unavailable.'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

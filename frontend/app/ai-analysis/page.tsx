'use client';

import { motion } from 'framer-motion';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Shield, TrendingUp, Lightbulb } from 'lucide-react';

export default function AIAnalysisPage() {
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
        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--indra-red)] to-pink-500 flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">47</div>
            <div className="text-sm text-muted-foreground">AI Insights Generated</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">23</div>
            <div className="text-sm text-muted-foreground">Optimizations Applied</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-[var(--indra-blue)] flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">5</div>
            <div className="text-sm text-muted-foreground">Security Issues Fixed</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">+15%</div>
            <div className="text-sm text-muted-foreground">Performance Gain</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AIInsightsPanel />
        </div>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-[var(--indra-accent)]" />
              <span>AI Analysis Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">System Scan</span>
                  <span className="text-white">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Security Analysis</span>
                  <span className="text-white">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Performance Check</span>
                  <span className="text-white">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Optimization Scan</span>
                  <span className="text-white">23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
            </div>

            <div className="p-4 bg-[var(--indra-dark)]/30 rounded-lg">
              <p className="text-sm text-[var(--indra-red)] font-medium mb-2">AI Status</p>
              <p className="text-xs text-muted-foreground">
                Neural networks are actively monitoring your system. Next full analysis scheduled in 2 hours.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
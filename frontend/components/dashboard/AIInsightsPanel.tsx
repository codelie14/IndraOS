'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Lightbulb, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSystemStore } from '@/store/useSystemStore';
import { systemAPI } from '@/lib/api';
import type { AIInsight } from '@/types/system';

interface AIInsightsPanelProps {
  insights: AIInsight[];
}

const severityColors: { [key: string]: string } = {
  Low: 'bg-blue-500/20 text-blue-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  High: 'bg-orange-500/20 text-orange-400',
  Critical: 'bg-red-500/20 text-red-400',
};

const typeIcons: { [key: string]: React.ElementType } = {
  Optimization: Lightbulb,
  Security: AlertTriangle,
  Performance: TrendingUp,
  Maintenance: CheckCircle,
};

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  const [analyzing, setAnalyzing] = useState(false);



  // const triggerAnalysis = async () => {
  //   try {
  //     setAnalyzing(true);
  //     const newInsights = await systemAPI.requestAIAnalysis();
  //     newInsights.forEach(insight => addInsight(insight));
  //   } catch (error) {
  //     console.error('Failed to trigger AI analysis:', error);
  //     // Mock insights for development
  //     const mockInsights: AIInsight[] = [
  //       {
  //         id: Date.now().toString(),
  //         type: 'optimization',
  //         severity: 'medium',
  //         title: 'Memory Optimization Opportunity',
  //         description: 'Detected unused memory allocations in system processes',
  //         recommendation: 'Consider restarting Chrome to free up 2.4GB of memory',
  //         confidence: 87,
  //         timestamp: new Date().toISOString(),
  //         applied: false,
  //       },
  //       {
  //         id: (Date.now() + 1).toString(),
  //         type: 'security',
  //         severity: 'high',
  //         title: 'Suspicious Network Activity',
  //         description: 'Unusual outbound connections detected from system process',
  //         recommendation: 'Review firewall rules and scan for potential threats',
  //         confidence: 92,
  //         timestamp: new Date().toISOString(),
  //         applied: false,
  //       },
  //     ];
  //     mockInsights.forEach(insight => addInsight(insight));
  //   } finally {
  //     setAnalyzing(false);
  //   }
  // };

  return (
    <Card className="bg-[var(--indra-surface)] border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="w-5 h-5 text-[var(--indra-red)]" />
            <span>Divine Insights</span>
          </CardTitle>
          <Button
            // onClick={triggerAnalysis}
            disabled={true || analyzing}
            size="sm"
            className="bg-[var(--indra-red)] hover:bg-[var(--indra-red)]/80"
          >
            {analyzing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              'Analysis Disabled'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {insights.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <Brain className="w-12 h-12 mx-auto mb-3 text-[var(--indra-red)]/50" />
              <p>No insights available. Click "Analyze System" to get AI-powered recommendations.</p>
            </motion.div>
          ) : (
            insights.slice(0, 5).map((insight, index) => {
              const Icon = typeIcons[insight.category] || Lightbulb;
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-[var(--indra-red)]/20 text-[var(--indra-red)]">
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">{insight.category}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={severityColors[insight.severity]}>
                            {insight.severity}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      
                      <div className="bg-[var(--indra-dark)]/50 p-3 rounded-lg">
                        <p className="text-sm text-white">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                  
                  {index < insights.length - 1 && <Separator className="my-4" />}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        
        {insights.length > 5 && (
          <Button variant="ghost" className="w-full mt-4 text-[var(--indra-red)]">
            View All Insights ({insights.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
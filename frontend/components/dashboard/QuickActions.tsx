'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  RefreshCw, 
  Shield, 
  Trash2, 
  Download, 
  Settings,
  Brain,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  action: () => void;
  dangerous?: boolean;
}

export function QuickActions() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const executeAction = async (actionId: string, action: () => void) => {
    try {
      setLoading(actionId);
      await action();
      toast({
        title: "Action Completed",
        description: "Divine intervention successful",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "The gods were not pleased",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const actions: QuickAction[] = [
    {
      id: 'optimize',
      label: 'Optimize System',
      icon: Zap,
      color: 'from-[var(--indra-red)] to-pink-500',
      description: 'AI-powered system optimization',
      action: () => new Promise(resolve => setTimeout(resolve, 2000)),
    },
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: RefreshCw,
      color: 'from-blue-500 to-[var(--indra-blue)]',
      description: 'Update all system metrics',
      action: () => new Promise(resolve => setTimeout(resolve, 1000)),
    },
    {
      id: 'security',
      label: 'Security Scan',
      icon: Shield,
      color: 'from-green-500 to-emerald-600',
      description: 'Full system security analysis',
      action: () => new Promise(resolve => setTimeout(resolve, 3000)),
    },
    {
      id: 'cleanup',
      label: 'Divine Cleanup',
      icon: Trash2,
      color: 'from-purple-500 to-violet-600',
      description: 'Clean temporary files and cache',
      action: () => new Promise(resolve => setTimeout(resolve, 2500)),
    },
    {
      id: 'ai-analysis',
      label: 'AI Deep Scan',
      icon: Brain,
      color: 'from-[var(--indra-accent)] to-yellow-500',
      description: 'Advanced AI system analysis',
      action: () => new Promise(resolve => setTimeout(resolve, 4000)),
    },
    {
      id: 'emergency',
      label: 'Emergency Stop',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-700',
      description: 'Stop all non-essential processes',
      action: () => new Promise(resolve => setTimeout(resolve, 1500)),
      dangerous: true,
    },
  ];

  return (
    <Card className="bg-[var(--indra-surface)] border-border/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Zap className="w-5 h-5 text-[var(--indra-red)]" />
          <span>Divine Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const isLoading = loading === action.id;
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => executeAction(action.id, action.action)}
                  disabled={loading !== null}
                  className={`w-full h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-br ${action.color} hover:shadow-lg transition-all duration-300 ${
                    action.dangerous ? 'ring-1 ring-red-500/50' : ''
                  }`}
                  variant="default"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6 text-white" />
                  )}
                  
                  <div className="text-center">
                    <div className="font-medium text-white text-sm">{action.label}</div>
                    <div className="text-xs text-white/80 mt-1">{action.description}</div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-[var(--indra-dark)]/30 rounded-lg border border-[var(--indra-red)]/20">
          <div className="flex items-center space-x-2 text-sm text-[var(--indra-red)]">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Divine Warning</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Emergency actions require administrator privileges and may affect system stability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
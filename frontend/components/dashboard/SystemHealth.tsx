'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useSystemStore } from '@/store/useSystemStore';

export function SystemHealth() {
  const metrics = useSystemStore((state) => state.metrics);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const score = useMemo(() => {
    if (!metrics) return 0;
    // Weighted average: 40% CPU, 40% Memory, 20% Disk
    const cpuScore = 100 - (metrics.cpu_usage || 0);
    const memoryScore = 100 - (metrics.memory_usage || 0);
    const diskScore = 100 - (metrics.disk_usage || 0);
    const healthScore = cpuScore * 0.4 + memoryScore * 0.4 + diskScore * 0.2;
    return Math.max(0, Math.min(100, Math.round(healthScore)));
  }, [metrics]);
  
  const getHealthStatus = (s: number) => {
    if (s >= 90) return { label: 'Excellent', color: 'text-green-400', icon: CheckCircle };
    if (s >= 75) return { label: 'Good', color: 'text-blue-400', icon: CheckCircle };
    if (s >= 60) return { label: 'Fair', color: 'text-yellow-400', icon: AlertCircle };
    return { label: 'Poor', color: 'text-red-400', icon: AlertCircle };
  };

  const healthStatus = getHealthStatus(score);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    const animatedScore = score; // In a real scenario, you might want to animate this value

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#1e2749';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Score arc
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (animatedScore / 100) * 2 * Math.PI;

    // Gradient for the score arc
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e94560');
    gradient.addColorStop(1, '#0f3460');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Score text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(animatedScore.toString(), centerX, centerY - 5);

    // Percentage text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter';
    ctx.fillText('%', centerX, centerY + 20);

  }, [score]);

  return (
    <Card className="bg-[var(--indra-surface)] border-border/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Shield className="w-5 h-5 text-[var(--indra-red)]" />
          <span>System Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              className="drop-shadow-lg"
            />
          </motion.div>

          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <healthStatus.icon className={`w-5 h-5 ${healthStatus.color}`} />
              <Badge className={`${healthStatus.color} bg-transparent border-current`}>
                {healthStatus.label}
              </Badge>
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              System health score based on current metrics.
            </motion.p>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-3 bg-[var(--indra-dark)]/30 rounded-lg">
              <div className="text-green-400 font-medium">Real-time</div>
              <div className="text-muted-foreground">Monitoring</div>
            </div>
            <div className="text-center p-3 bg-[var(--indra-dark)]/30 rounded-lg">
              <div className="text-blue-400 font-medium">Live</div>
              <div className="text-muted-foreground">Data Feed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

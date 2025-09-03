'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useSystemStore } from '@/store/useSystemStore';

interface SystemHealthProps {
  score?: number;
}

export function SystemHealth({ score = 85 }: SystemHealthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const getHealthStatus = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-400', icon: CheckCircle };
    if (score >= 75) return { label: 'Good', color: 'text-blue-400', icon: CheckCircle };
    if (score >= 60) return { label: 'Fair', color: 'text-yellow-400', icon: AlertCircle };
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
    const endAngle = startAngle + (score / 100) * 2 * Math.PI;

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
    ctx.fillText(score.toString(), centerX, centerY - 5);

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
              Your system is under Indra's divine protection
            </motion.p>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-3 bg-[var(--indra-dark)]/30 rounded-lg">
              <div className="text-green-400 font-medium">12</div>
              <div className="text-muted-foreground">Optimizations</div>
            </div>
            <div className="text-center p-3 bg-[var(--indra-dark)]/30 rounded-lg">
              <div className="text-blue-400 font-medium">3</div>
              <div className="text-muted-foreground">Issues Fixed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
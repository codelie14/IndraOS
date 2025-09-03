'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Wifi,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Divine Settings</h1>
        <p className="text-muted-foreground">
          Configure IndraOS to match your divine preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Palette className="w-5 h-5 text-[var(--indra-red)]" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-white">Dark Theme</Label>
              <Switch id="dark-mode" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="animations" className="text-white">Divine Animations</Label>
              <Switch id="animations" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sidebar" className="text-white">Sidebar Auto-collapse</Label>
              <Switch id="sidebar" />
            </div>

            <Separator className="border-border/30" />

            <div className="space-y-3">
              <Label className="text-white">Refresh Intervals</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Metrics (seconds)</Label>
                  <Input defaultValue="5" className="bg-[var(--indra-dark)]/50" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Processes (seconds)</Label>
                  <Input defaultValue="10" className="bg-[var(--indra-dark)]/50" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Bell className="w-5 h-5 text-[var(--indra-blue)]" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="alerts" className="text-white">System Alerts</Label>
              <Switch id="alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-insights" className="text-white">AI Insights</Label>
              <Switch id="ai-insights" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="critical-only" className="text-white">Critical Alerts Only</Label>
              <Switch id="critical-only" />
            </div>

            <Separator className="border-border/30" />

            <div className="space-y-3">
              <Label className="text-white">Alert Thresholds</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">CPU Usage (%)</Label>
                  <Input defaultValue="80" className="bg-[var(--indra-dark)]/50" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Memory Usage (%)</Label>
                  <Input defaultValue="85" className="bg-[var(--indra-dark)]/50" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Disk Usage (%)</Label>
                  <Input defaultValue="90" className="bg-[var(--indra-dark)]/50" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[var(--indra-accent)]" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-scan" className="text-white">Auto Security Scan</Label>
              <Switch id="auto-scan" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="real-time" className="text-white">Real-time Protection</Label>
              <Switch id="real-time" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="quarantine" className="text-white">Auto Quarantine</Label>
              <Switch id="quarantine" />
            </div>

            <Separator className="border-border/30" />

            <div className="space-y-3">
              <Label className="text-white">Security Levels</Label>
              <div className="space-y-3">
                <div className="p-3 bg-[var(--indra-dark)]/30 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Firewall Status</span>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                </div>
                <div className="p-3 bg-[var(--indra-dark)]/30 rounded-lg border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Antivirus</span>
                    <span className="text-xs text-blue-400">Updated</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--indra-surface)] border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span>Data & Storage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup" className="text-white">Auto Backup Reports</Label>
              <Switch id="auto-backup" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="data-retention" className="text-white">Data Retention (days)</Label>
              <Input defaultValue="30" className="w-20 bg-[var(--indra-dark)]/50" />
            </div>

            <Separator className="border-border/30" />

            <Button className="w-full bg-[var(--indra-red)] hover:bg-[var(--indra-red)]/80">
              <Save className="w-4 h-4 mr-2" />
              Save Divine Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Bell, User, Moon, Sun, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useSystemStore } from '@/store/useSystemStore';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { 
    connectionStatus, 
    alerts,
    toggleSidebar
  } = useSystemStore();
  
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const unreadAlerts = alerts.filter(alert => !alert.read).length;

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleThemeToggle = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    console.log('Setting theme to:', newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="h-16 bg-[var(--indra-surface)] border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--indra-red)] to-[var(--indra-blue)] flex items-center justify-center font-bold text-white text-sm animate-glow">
                I
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IndraOS</h1>
                <p className="text-xs text-muted-foreground">Divine System Analyzer</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Moon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-[var(--indra-surface)] border-b border-border/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className=""
          >
            <div className="w-5 h-5 flex flex-col justify-center">
              <div className="w-full h-0.5 bg-current mb-1 transition-all"></div>
              <div className="w-full h-0.5 bg-current mb-1 transition-all"></div>
              <div className="w-full h-0.5 bg-current transition-all"></div>
            </div>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--indra-red)] to-[var(--indra-blue)] flex items-center justify-center font-bold text-white text-sm animate-glow">
              I
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">IndraOS</h1>
              <p className="text-xs text-muted-foreground">Divine System Analyzer</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              {connectionStatus === 'connected' ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className="capitalize">{connectionStatus}</span>
            </div>
            <span>•</span>
            <span>{currentTime?.toLocaleTimeString() || '--:--:--'}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleThemeToggle}
            className="relative"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {unreadAlerts > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full bg-[var(--indra-red)] animate-pulse-divine">
                    {unreadAlerts > 9 ? '9+' : unreadAlerts}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Divine Alerts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {alerts.slice(0, 5).map((alert) => (
                <DropdownMenuItem key={alert.id} className="flex flex-col items-start p-3">
                  <div className="flex w-full justify-between items-start">
                    <span className="font-medium">{alert.title}</span>
                    <Badge variant={alert.type === 'error' ? 'destructive' : 'default'}>
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <span className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </DropdownMenuItem>
              ))}
              {alerts.length === 0 && (
                <DropdownMenuItem className="text-center text-muted-foreground">
                  No alerts
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Administrator</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>System Preferences</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
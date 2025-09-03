'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Monitor, TrendingUp, Cpu, Settings2, 
  Shield, Wifi, FileText, Brain, BarChart3, Cog 
} from 'lucide-react';
import { useSystemStore } from '@/store/useSystemStore';
import { NAVIGATION_ITEMS } from '@/lib/constants';

const iconMap = {
  LayoutDashboard,
  Monitor,
  TrendingUp,
  Cpu,
  Settings2,
  Shield,
  Wifi,
  FileText,
  Brain,
  BarChart3,
  Cog,
} as const;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useSystemStore();

  return (
    <aside className={cn(
      "bg-[var(--indra-surface)] border-r border-border/50 transition-all duration-300 ease-in-out flex flex-col",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-[var(--indra-red)] text-white shadow-lg indra-glow"
                    : "text-muted-foreground hover:text-white hover:bg-[var(--indra-red)]/10"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-[var(--indra-red)]"
                )} />
                {!sidebarCollapsed && (
                  <span className="ml-3 transition-opacity duration-300">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {!sidebarCollapsed && (
        <div className="p-4 border-t border-border/50">
          <div className="bg-gradient-to-r from-[var(--indra-red)]/20 to-[var(--indra-blue)]/20 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-white">Divine Power</p>
            <p className="text-xs text-muted-foreground mt-1">
              System under Indra's protection
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
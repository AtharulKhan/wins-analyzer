
import React from 'react';
import { 
  ChevronRight, ChevronLeft, 
  LayoutList, BarChart, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const location = useLocation();
  
  // Navigation items for the wins tracker app
  const navItems = [
    {
      title: 'Finished Projects',
      icon: LayoutList,
      href: '/',
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-50',
      darkBgGradient: 'dark:from-blue-950/20 dark:to-purple-950/20'
    },
    {
      title: 'Project Ideas (To Do)',
      icon: LayoutList,
      href: '/project-ideas',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBgGradient: 'dark:from-emerald-950/20 dark:to-teal-950/20'
    },
    {
      title: 'Dashboard',
      icon: BarChart,
      href: '/dashboard',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      darkBgGradient: 'dark:from-orange-950/20 dark:to-red-950/20'
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
      gradient: 'from-gray-500 to-slate-600',
      bgGradient: 'from-gray-50 to-slate-50',
      darkBgGradient: 'dark:from-gray-950/20 dark:to-slate-950/20'
    }
  ];

  return (
    <aside className={cn(
      "bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 text-slate-700 dark:text-slate-200 relative transition-all duration-300 ease-in-out flex flex-col border-r border-slate-200/60 dark:border-slate-700/60 shadow-lg backdrop-blur-sm",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-900/80">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isCollapsed ? "opacity-0 scale-90" : "opacity-100 scale-100"
        )}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <LayoutList className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-bold text-lg bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
            Wins Tracker
          </h2>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "absolute right-2 h-8 w-8 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg hover:bg-white dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 transition-all duration-200",
            isCollapsed ? "right-2" : "right-4"
          )}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1 py-6">
        <nav className="px-3 space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                  isActive 
                    ? `bg-gradient-to-r ${item.bgGradient} ${item.darkBgGradient} shadow-md border border-white/60 dark:border-slate-600/40` 
                    : "hover:bg-gradient-to-r hover:from-slate-50 hover:to-white dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 hover:shadow-sm",
                  isCollapsed && "justify-center px-0 w-12 h-12 mx-auto"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b rounded-r-full transition-all duration-300",
                    item.gradient,
                    isCollapsed ? "opacity-0" : "opacity-100"
                  )} />
                )}
                
                {/* Icon container */}
                <div className={cn(
                  "relative flex items-center justify-center transition-all duration-200",
                  isActive 
                    ? `w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} shadow-lg` 
                    : "w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:shadow-md",
                  isCollapsed && "w-6 h-6"
                )}>
                  <item.icon className={cn(
                    "transition-all duration-200",
                    isActive ? "h-4 w-4 text-white" : "h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300",
                    isCollapsed && "h-3.5 w-3.5"
                  )} />
                </div>
                
                {/* Text */}
                <span className={cn(
                  "text-sm font-medium transition-all duration-200",
                  isActive 
                    ? `bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent font-semibold` 
                    : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}>
                  {item.title}
                </span>

                {/* Hover effect */}
                <div className={cn(
                  "absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-200",
                  item.gradient
                )} />
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-900/80">
        <div className={cn(
          "transition-all duration-300 rounded-xl p-3 bg-gradient-to-br from-slate-100/80 to-white/80 dark:from-slate-800/80 dark:to-slate-700/80 border border-slate-200/60 dark:border-slate-600/40 shadow-sm",
          isCollapsed ? "opacity-0 scale-90" : "opacity-100 scale-100"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
            <p className="font-semibold text-xs text-slate-700 dark:text-slate-300">App Status</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Data last updated: Now</p>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="inline-flex items-center gap-1">
              <span className="text-blue-600 dark:text-blue-400 font-bold">4</span>
              <span>Wins Tracked</span>
            </span>
          </p>
        </div>
      </div>
    </aside>
  );
}

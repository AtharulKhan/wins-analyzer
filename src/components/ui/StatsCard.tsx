
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  className,
  valueClassName,
  onClick,
}: StatsCardProps) {
  const formattedTrend = trend !== undefined ? (trend > 0 ? `+${trend.toFixed(2)}%` : `${trend.toFixed(2)}%`) : null;
  const isTrendPositive = trend !== undefined ? trend > 0 : null;
  
  return (
    <Card 
      className={cn(
        "group relative transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm",
        onClick ? "cursor-pointer hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10" : "",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
            {icon}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
          <span className={valueClassName}>{value}</span>
        </div>
        
        {(description || trend !== undefined) && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              {trend !== undefined && (
                <div className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full mr-2 transition-all duration-300",
                  isTrendPositive 
                    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400" 
                    : "text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400"
                )}>
                  {isTrendPositive ? (
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  <span className="font-medium">{formattedTrend}</span>
                </div>
              )}
              {trendLabel && (
                <span className="text-muted-foreground font-medium">
                  {trendLabel}
                </span>
              )}
            </div>
            
            {description && (
              <span className="text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-300">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Subtle animated border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
           style={{ 
             mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
             maskComposite: 'xor',
             WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
             WebkitMaskComposite: 'xor',
             padding: '1px'
           }} 
      />
    </Card>
  );
}

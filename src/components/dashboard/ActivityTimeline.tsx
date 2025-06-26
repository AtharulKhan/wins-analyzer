
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityTimelineProps {
  winsByPeriod: {
    total: number;
    last7Days: number;
    last30Days: number;
    last90Days: number;
  };
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ 
  winsByPeriod 
}) => {
  return (
    <Card className="group relative w-full h-full overflow-hidden bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm border-0 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
          Time Period Activity
        </CardTitle>
        <p className="text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-300">
          Your wins over different time periods
        </p>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last 7 days</span>
              <span className="text-sm font-semibold text-primary">{winsByPeriod.last7Days} wins</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${(winsByPeriod.last7Days / winsByPeriod.total) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last 30 days</span>
              <span className="text-sm font-semibold text-emerald-600">{winsByPeriod.last30Days} wins</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-1000 ease-out delay-200" 
                style={{ width: `${(winsByPeriod.last30Days / winsByPeriod.total) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last 90 days</span>
              <span className="text-sm font-semibold text-orange-600">{winsByPeriod.last90Days} wins</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full transition-all duration-1000 ease-out delay-500" 
                style={{ width: `${(winsByPeriod.last90Days / winsByPeriod.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
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
};

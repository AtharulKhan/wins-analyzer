
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
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Time Period Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Your wins over different time periods</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Last 7 days</span>
            <span className="text-sm">{winsByPeriod.last7Days} wins</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${(winsByPeriod.last7Days / winsByPeriod.total) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium">Last 30 days</span>
            <span className="text-sm">{winsByPeriod.last30Days} wins</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-success h-2.5 rounded-full" 
              style={{ width: `${(winsByPeriod.last30Days / winsByPeriod.total) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium">Last 90 days</span>
            <span className="text-sm">{winsByPeriod.last90Days} wins</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-warning h-2.5 rounded-full" 
              style={{ width: `${(winsByPeriod.last90Days / winsByPeriod.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

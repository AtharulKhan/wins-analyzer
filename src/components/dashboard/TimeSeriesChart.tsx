
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeSeriesPoint } from './useTimeSeriesData';

interface TimeSeriesChartProps {
  timeSeriesData: TimeSeriesPoint[];
  chartConfig: {
    timeSeries: {
      color: string;
    };
  };
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ 
  timeSeriesData, 
  chartConfig 
}) => {
  return (
    <Card className="group relative w-full h-full overflow-hidden bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm border-0 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
          Wins Over Time
        </CardTitle>
        <p className="text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-300">
          Last 6 months activity
        </p>
      </CardHeader>
      
      <CardContent className="p-0 pb-6 relative z-10">
        <div className="h-[300px] w-full px-6 overflow-hidden">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} className="animate-pulse" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Wins" 
                  stroke="#0EA5E9" 
                  strokeWidth={3}
                  dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#0EA5E9', strokeWidth: 2, fill: '#fff' }}
                  className="animate-pulse"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
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

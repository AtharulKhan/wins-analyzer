
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
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Wins Over Time</CardTitle>
        <p className="text-sm text-muted-foreground">Last 6 months activity</p>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <div className="h-[300px] w-full px-4 overflow-hidden">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Wins" 
                  stroke="#0EA5E9" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

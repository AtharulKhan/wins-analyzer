
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from "@/components/ui/chart";
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Cell, Tooltip,
  ResponsiveContainer 
} from 'recharts';
import { CategoryItem } from './useCategoryData';
import { ChartTooltipContent } from "@/components/ui/chart";

interface CategoryBubbleChartProps {
  categoryData: CategoryItem[];
  handleBubbleClick: (data: any) => void;
  zAxisDomain: number[];
  chartConfig: {
    categoryBubble: {
      color: string;
    };
  };
}

export const CategoryBubbleChart: React.FC<CategoryBubbleChartProps> = ({ 
  categoryData, 
  handleBubbleClick, 
  zAxisDomain,
  chartConfig 
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Wins by Category</CardTitle>
        <p className="text-sm text-muted-foreground">Size represents number of wins in each category</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="category" dataKey="name" name="Category" />
                <YAxis type="number" dataKey="value" name="Count" />
                <ZAxis type="number" dataKey="z" range={[20, 60]} domain={zAxisDomain} />
                <Tooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter 
                  name="Categories" 
                  data={categoryData} 
                  fill="#8884d8"
                  onClick={handleBubbleClick}
                  className="cursor-pointer"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

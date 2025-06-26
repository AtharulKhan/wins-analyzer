
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
    <Card className="group relative w-full h-full overflow-hidden bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm border-0 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
          Wins by Category
        </CardTitle>
        <p className="text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-300">
          Size represents number of wins in each category
        </p>
      </CardHeader>
      
      <CardContent className="p-0 pb-6 relative z-10">
        <div className="h-[300px] w-full px-6 overflow-hidden">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} className="animate-pulse" />
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

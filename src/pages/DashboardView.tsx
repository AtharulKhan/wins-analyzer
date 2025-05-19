
import React, { useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import { Calendar, Star, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { WinsTracker } from '@/components/wins/WinsTracker';

const DashboardView = () => {
  const { toast } = useToast();
  
  // Sample data - in a real app, this would come from your WinsTracker component
  const mockCategoryData = [
    { name: 'Web Development', value: 4, fill: '#8B5CF6' },
    { name: 'AI', value: 3, fill: '#D946EF' },
    { name: 'SEO', value: 2, fill: '#F97316' },
    { name: 'Fitness', value: 2, fill: '#0EA5E9' },
    { name: 'Learning', value: 2, fill: '#22C55E' },
    { name: 'DevOps', value: 1, fill: '#EAB308' }
  ];

  // Common theme keywords
  const keywords = [
    'implemented', 'finished', 'optimized', 'time', 'learning', 'optimization', 
    'first', 'consistent', 'completed', 'proper', 'deployment', 'tech', 'machine', 
    'model', 'accuracy', 'client', 'used', 'article', 'content', 'personal'
  ];

  return (
    <PageLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Cards Row */}
        <StatsCard
          title="Wins This Week"
          value="0"
          icon={<Calendar className="h-4 w-4" />}
          className="bg-primary/5"
        />
        
        <StatsCard
          title="Top Categories"
          value="Web Development"
          description="4 wins in this category"
          icon={<BarChart className="h-4 w-4" />}
          className="bg-primary/5"
        />
        
        <StatsCard
          title="Favorite Wins"
          value="6"
          icon={<Star className="h-4 w-4" />}
          className="bg-success/5"
        />
        
        <StatsCard
          title="Current Streak"
          value="0 days"
          description="Longest: 0 days"
          icon={<TrendingUp className="h-4 w-4" />}
          className="bg-danger/5"
        />

        {/* Wins by Category Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Wins by Category</CardTitle>
            <p className="text-sm text-muted-foreground">Distribution of your achievements</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockCategoryData} layout="vertical" margin={{ left: 80 }}>
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {mockCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Streak Tracker */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Streak Tracker</CardTitle>
            <p className="text-sm text-muted-foreground">Your consistency over time</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold">Current Streak</div>
                <div className="text-3xl font-bold">0 days</div>
                <div className="text-sm text-muted-foreground mt-2">Longest Streak: 0 days</div>
              </div>
              <div className="w-full h-12 bg-muted/20 rounded-md flex items-center justify-between px-4">
                <span className="text-xs text-muted-foreground">Feb 19</span>
                <div className="h-2 bg-muted rounded-full flex-1 mx-4"></div>
                <span className="text-xs text-muted-foreground">May 19</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Themes */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Common Themes</CardTitle>
            <p className="text-sm text-muted-foreground">Frequently mentioned keywords</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {keywords.map((keyword, index) => (
                <div 
                  key={keyword}
                  className="px-3 py-1.5 bg-muted/30 rounded-full text-sm"
                  style={{ 
                    fontSize: `${Math.max(0.8, Math.min(1.4, 0.8 + Math.random() * 0.6))}rem`,
                    opacity: Math.max(0.6, Math.min(1, 0.6 + Math.random() * 0.4))
                  }}
                >
                  {keyword}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-4">
          <CardContent className="py-4 flex justify-center">
            <Button>Export dashboard as PNG</Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DashboardView;

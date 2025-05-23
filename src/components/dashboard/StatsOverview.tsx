
import React from 'react';
import { StatsCard } from '@/components/ui/StatsCard';
import { CalendarDays, ChartPieIcon, TrendingUp, Clock, FileText } from 'lucide-react';
import { TopCategory } from './useCategoryData';

interface StatsOverviewProps {
  winsByPeriod: {
    total: number;
    last7Days: number;
    last30Days: number;
    last90Days: number;
  };
  topCategories: TopCategory[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ 
  winsByPeriod, 
  topCategories 
}) => {
  return (
    <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Stats Cards Row */}
      <StatsCard
        title="Total Wins"
        value={winsByPeriod.total.toString()}
        icon={<FileText className="h-4 w-4" />}
        className="bg-primary/5"
      />
      
      <StatsCard
        title="Last 7 Days"
        value={winsByPeriod.last7Days.toString()}
        description={`${winsByPeriod.last7Days} wins recorded`}
        icon={<CalendarDays className="h-4 w-4" />}
        className="bg-primary/5"
      />
      
      <StatsCard
        title="Last 30 Days"
        value={winsByPeriod.last30Days.toString()}
        description={`${winsByPeriod.last30Days} wins recorded`}
        icon={<Clock className="h-4 w-4" />}
        className="bg-success/5"
      />
      
      <StatsCard
        title="Last 90 Days"
        value={winsByPeriod.last90Days.toString()}
        description={`${winsByPeriod.last90Days} wins recorded`}
        icon={<TrendingUp className="h-4 w-4" />}
        className="bg-danger/5"
      />

      {/* Top Categories */}
      {topCategories.map((category, index) => (
        <StatsCard
          key={index}
          title={category.title}
          value={category.name}
          description={`${category.count} wins recorded`}
          icon={<ChartPieIcon className="h-4 w-4" />}
          valueClassName={`text-[${category.color}]`}
          className="bg-secondary/5"
        />
      ))}
    </div>
  );
};


import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

// Import custom hooks
import { useDashboardData } from '@/components/dashboard/useDashboardData';
import { useCategoryData } from '@/components/dashboard/useCategoryData';
import { useTimeSeriesData } from '@/components/dashboard/useTimeSeriesData';
import { useKeywordData } from '@/components/dashboard/useKeywordData';

// Import components
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { CategoryBubbleChart } from '@/components/dashboard/CategoryBubbleChart';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { CumulativeChart } from '@/components/dashboard/CumulativeChart';
import { ThemeCloud } from '@/components/dashboard/ThemeCloud';
import { CategoryWinsDialog } from '@/components/dashboard/CategoryWinsDialog';
import { ExportButton } from '@/components/dashboard/ExportButton';

const DashboardView = () => {
  // Fetch and process data using hooks
  const { activeWins } = useDashboardData();
  const { 
    categoryData, 
    topCategories, 
    selectedCategory,
    categoryWins, 
    dialogOpen, 
    setDialogOpen,
    handleBubbleClick,
    zAxisDomain
  } = useCategoryData(activeWins);
  const { winsByPeriod, timeSeriesData, cumulativeWinsData } = useTimeSeriesData(activeWins);
  const { commonKeywords } = useKeywordData(activeWins);

  // Chart configuration
  const chartConfig = {
    categoryBubble: {
      color: '#8B5CF6',
    },
    categoryBar: {
      color: '#8B5CF6',
    },
    pieSegment: {
      color: '#8B5CF6',
    },
    timeSeries: {
      color: '#0EA5E9',
    },
    cumulative: {
      color: '#F97316',
    },
  };

  return (
    <PageLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Overview Cards */}
        <StatsOverview winsByPeriod={winsByPeriod} topCategories={topCategories} />

        {/* Category Bubble Chart */}
        <CategoryBubbleChart 
          categoryData={categoryData} 
          handleBubbleClick={handleBubbleClick} 
          zAxisDomain={zAxisDomain}
          chartConfig={chartConfig} 
        />

        {/* Activity Timeline */}
        <ActivityTimeline winsByPeriod={winsByPeriod} />

        {/* Time Series Chart */}
        <TimeSeriesChart timeSeriesData={timeSeriesData} chartConfig={chartConfig} />

        {/* Cumulative Chart */}
        <CumulativeChart cumulativeWinsData={cumulativeWinsData} chartConfig={chartConfig} />

        {/* Theme Cloud */}
        <ThemeCloud commonKeywords={commonKeywords} />

        {/* Export Button */}
        <ExportButton />
      </div>

      {/* Category Wins Dialog */}
      <CategoryWinsDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        selectedCategory={selectedCategory} 
        categoryWins={categoryWins} 
      />
    </PageLayout>
  );
};

export default DashboardView;

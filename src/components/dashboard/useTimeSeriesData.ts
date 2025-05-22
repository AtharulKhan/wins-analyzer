
import { useMemo } from 'react';
import { Win } from './useDashboardData';

export interface TimeSeriesPoint {
  month: string;
  count: number;
}

export interface CumulativePoint extends TimeSeriesPoint {
  cumulative: number;
}

export const useTimeSeriesData = (activeWins: Win[]) => {
  // Calculate wins in different time periods
  const winsByPeriod = useMemo(() => {
    const today = new Date();
    
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);
    
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);
    
    const last90Days = new Date(today);
    last90Days.setDate(today.getDate() - 90);
    
    return {
      total: activeWins.length,
      last7Days: activeWins.filter(win => {
        const winDate = new Date(win.date);
        return winDate >= last7Days && winDate <= today;
      }).length,
      last30Days: activeWins.filter(win => {
        const winDate = new Date(win.date);
        return winDate >= last30Days && winDate <= today;
      }).length,
      last90Days: activeWins.filter(win => {
        const winDate = new Date(win.date);
        return winDate >= last90Days && winDate <= today;
      }).length,
    };
  }, [activeWins]);

  // Get time series data for last 6 months
  const timeSeriesData = useMemo(() => {
    if (!activeWins.length) return [];
    
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    // Create an array of months
    const months: Record<string, number> = {};
    for (let i = 0; i <= 6; i++) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      months[monthYear] = 0;
    }
    
    // Count wins per month
    activeWins.forEach(win => {
      const winDate = new Date(win.date);
      if (winDate >= sixMonthsAgo) {
        const monthYear = winDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (months[monthYear] !== undefined) {
          months[monthYear]++;
        }
      }
    });
    
    // Convert to array and sort chronologically
    return Object.entries(months)
      .map(([month, count]) => ({ month, count }))
      .reverse();
  }, [activeWins]);

  // Get cumulative wins data
  const cumulativeWinsData = useMemo(() => {
    if (!activeWins.length) return [];
    
    const sortedWins = [...activeWins].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    const monthlyData: Record<string, { count: number, cumulative: number }> = {};
    let cumulativeTotal = 0;
    
    sortedWins.forEach(win => {
      const monthYear = new Date(win.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { count: 0, cumulative: 0 };
      }
      
      monthlyData[monthYear].count++;
      cumulativeTotal++;
      monthlyData[monthYear].cumulative = cumulativeTotal;
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      count: data.count,
      cumulative: data.cumulative
    }));
  }, [activeWins]);

  return { winsByPeriod, timeSeriesData, cumulativeWinsData };
};

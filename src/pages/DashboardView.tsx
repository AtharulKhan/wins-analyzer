
import React, { useMemo, useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart as BarChartIcon, Calendar, Star, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useLocalStorage } from '@/hooks/use-local-storage';

interface Win {
  id: string;
  title: string;
  category: string;
  date: Date;
  link: string;
  desc: string;
}

const DashboardView = () => {
  const { toast } = useToast();
  const [apiKey] = useLocalStorage('google-sheets-api-key', '');
  const [sheetId] = useLocalStorage('google-sheets-id', '1zx957CNpMus2IOY17j0TIt5yopSWs1v3AkAf7TSnExw');
  const [range] = useLocalStorage('google-sheets-range', 'Master!A2:E');
  
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites] = useLocalStorage('win-favorites', [] as string[]);
  const [archived] = useLocalStorage('win-archived', [] as string[]);

  // Fetch data from Google Sheets
  const fetchData = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Not Set",
        description: "Please go to Settings and enter your Google Sheets API key.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.values && data.values.length) {
        const parsedWins: Win[] = data.values.map((row: string[], index: number) => {
          const [title, category, dateStr, link, desc] = row;
          const id = `win-${index}-${dateStr}`;
          return {
            id,
            title: title || 'Untitled',
            category: category || 'Uncategorized',
            date: dateStr ? new Date(dateStr) : new Date(),
            link: link || '',
            desc: desc || '',
          };
        });
        
        setWins(parsedWins);
      } else {
        toast({
          title: "No data found",
          description: "Your sheet is empty or the range doesn't contain data.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Failed to load data",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, sheetId, range]);

  // Filter out archived wins
  const activeWins = useMemo(() => {
    return Array.isArray(wins) ? wins.filter(win => !archived.includes(win.id)) : [];
  }, [wins, archived]);

  // Get category data
  const categoryData = useMemo(() => {
    // Count occurrences of each category
    const categories: Record<string, number> = {};
    
    activeWins.forEach(win => {
      if (win.category) {
        const cats = win.category.split(',');
        cats.forEach(cat => {
          const trimmedCat = cat.trim();
          if (trimmedCat) {
            categories[trimmedCat] = (categories[trimmedCat] || 0) + 1;
          }
        });
      }
    });
    
    // Convert to array for chart
    const categoryArray = Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    // Assign colors
    const colors = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22C55E', '#EAB308', '#EC4899', '#06B6D4'];
    
    return categoryArray.map((category, index) => ({
      ...category,
      fill: colors[index % colors.length]
    }));
  }, [activeWins]);

  // Get top category
  const topCategory = useMemo(() => {
    return categoryData.length > 0 ? 
      { name: categoryData[0].name, count: categoryData[0].value } : 
      { name: "None", count: 0 };
  }, [categoryData]);

  // Calculate wins this week
  const winsThisWeek = useMemo(() => {
    if (!activeWins.length) return 0;
    
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    
    return activeWins.filter(win => {
      const winDate = new Date(win.date);
      return winDate >= weekStart && winDate <= today;
    }).length;
  }, [activeWins]);

  // Calculate streak data
  const streakData = useMemo(() => {
    if (!activeWins.length) return { current: 0, longest: 0 };
    
    // Sort wins by date
    const sortedWins = [...activeWins].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Group wins by date
    const winsByDate: Record<string, boolean> = {};
    sortedWins.forEach(win => {
      const dateStr = new Date(win.date).toISOString().split('T')[0];
      winsByDate[dateStr] = true;
    });
    
    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    // Check backwards from today
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (winsByDate[dateStr]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let currentRun = 0;
    const allDates = Object.keys(winsByDate).sort();
    
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        currentRun = 1;
        continue;
      }
      
      const currDate = new Date(allDates[i]);
      const prevDate = new Date(allDates[i-1]);
      
      // Calculate days between
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        // Consecutive days
        currentRun++;
      } else {
        // Break in streak
        longestStreak = Math.max(longestStreak, currentRun);
        currentRun = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, currentRun);
    
    return { current: currentStreak, longest: longestStreak };
  }, [activeWins]);

  // Extract common themes/keywords from all fields
  const commonKeywords = useMemo(() => {
    if (!activeWins.length) return [];
    
    // Combine all text from wins
    let allText = activeWins.map(win => 
      `${win.title || ''} ${win.category || ''} ${win.desc || ''}`
    ).join(' ').toLowerCase();
    
    // Remove common stop words and short words
    const stopWords = ['the', 'and', 'a', 'to', 'in', 'with', 'of', 'for', 'on', 'at', 'from', 'by'];
    const words = allText.split(/\W+/).filter(word => 
      word.length > 2 && !stopWords.includes(word)
    );
    
    // Count word frequencies
    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    // Convert to array and sort by frequency
    return Object.entries(wordCounts)
      .filter(([_, count]) => count > 1) // Only include words that appear more than once
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20) // Take top 20
      .map(([word]) => word);
  }, [activeWins]);

  const chartConfig = {
    categoryBar: {
      color: '#8B5CF6',
    },
  };

  const handleExportDashboard = () => {
    toast({
      title: "Export Initiated",
      description: "Dashboard image export has started",
    });
    // In a real app, we would use html2canvas or similar library to export as PNG
  };

  // Range for the streak timeline
  const streakTimelineRange = useMemo(() => {
    if (!activeWins.length) return { start: 'Feb 19', end: 'May 19' };
    
    const dates = activeWins.map(win => new Date(win.date));
    const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const newestDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Format dates
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    return {
      start: formatDate(oldestDate),
      end: formatDate(newestDate)
    };
  }, [activeWins]);

  return (
    <PageLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Cards Row */}
        <StatsCard
          title="Wins This Week"
          value={winsThisWeek.toString()}
          icon={<Calendar className="h-4 w-4" />}
          className="bg-primary/5"
        />
        
        <StatsCard
          title="Top Categories"
          value={topCategory.name}
          description={`${topCategory.count} wins in this category`}
          icon={<BarChartIcon className="h-4 w-4" />}
          className="bg-primary/5"
        />
        
        <StatsCard
          title="Favorite Wins"
          value={favorites.length.toString()}
          icon={<Star className="h-4 w-4" />}
          className="bg-success/5"
        />
        
        <StatsCard
          title="Current Streak"
          value={`${streakData.current} days`}
          description={`Longest: ${streakData.longest} days`}
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
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ left: 80 }}>
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
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
                <div className="text-3xl font-bold">{streakData.current} days</div>
                <div className="text-sm text-muted-foreground mt-2">Longest Streak: {streakData.longest} days</div>
              </div>
              <div className="w-full h-12 bg-muted/20 rounded-md flex items-center justify-between px-4">
                <span className="text-xs text-muted-foreground">{streakTimelineRange.start}</span>
                <div className="h-2 bg-muted rounded-full flex-1 mx-4"></div>
                <span className="text-xs text-muted-foreground">{streakTimelineRange.end}</span>
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
              {commonKeywords.map((keyword, index) => (
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
            <Button onClick={handleExportDashboard}>Export dashboard as PNG</Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DashboardView;

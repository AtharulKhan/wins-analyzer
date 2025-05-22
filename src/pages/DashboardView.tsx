import React, { useMemo, useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, Legend, CartesianGrid, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { CalendarDays, ChartPieIcon, TrendingUp, Clock, ChartLine, FileText } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Hard-coded Google Sheets API values
const GOOGLE_SHEETS_API_KEY = 'AIzaSyDsoN29aqbA8yJPVoORiTemvl21ft1zBls';
const GOOGLE_SHEETS_ID = '1zx957CNpMus2IOY17j0TIt5yopSWs1v3AkAf7TSnExw';
const GOOGLE_SHEETS_RANGE = 'Master!A2:H';

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
  const [archived] = useLocalStorage('win-archived', [] as string[]);
  
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryWins, setCategoryWins] = useState<Win[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch data from Google Sheets
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${GOOGLE_SHEETS_RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.values && data.values.length) {
        const parsedWins: Win[] = data.values.map((row: string[], index: number) => {
          const [title, category, subCategories, summary, platform, dateStr, linkText, linkUrl] = row;
          const id = `win-${index}-${dateStr}`;
          return {
            id,
            title: title || 'Untitled',
            category: category || 'Uncategorized',
            date: dateStr ? new Date(dateStr) : new Date(),
            link: linkUrl || '',
            desc: summary || '',
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
  }, []);

  // Filter out archived wins
  const activeWins = useMemo(() => {
    return Array.isArray(wins) ? wins.filter(win => !archived.includes(win.id)) : [];
  }, [wins, archived]);

  // Get category data with enhanced bubble chart format
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
    
    // Assign colors and calculate sizes for bubble chart
    const colors = [
      '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22C55E', 
      '#EAB308', '#EC4899', '#06B6D4', '#9b87f5', '#7E69AB', 
      '#6E59A5', '#D6BCFA', '#33C3F0', '#ea384c'
    ];
    
    return categoryArray.map((category, index) => ({
      ...category,
      fill: colors[index % colors.length],
      // Normalize size for bubble chart (min size 20, max size 60)
      z: Math.max(20, Math.min(60, category.value * 5))
    }));
  }, [activeWins]);

  // Handle bubble click (similar to pie click)
  const handleBubbleClick = (data: any) => {
    if (data && data.payload && data.payload.name) {
      const category = data.payload.name;
      // Find all wins with this category
      const winsInCategory = activeWins.filter(win => {
        const categories = win.category.split(',').map(cat => cat.trim());
        return categories.includes(category);
      });
      
      setSelectedCategory(category);
      setCategoryWins(winsInCategory);
      setDialogOpen(true);
    }
  };

  // Get top categories (top 3)
  const topCategories = useMemo(() => {
    return categoryData.slice(0, 3).map((category, index) => {
      const titles = ['Top', 'Second', 'Third'];
      return {
        title: `${titles[index]} Category`,
        name: category.name,
        count: category.value,
        color: category.fill
      };
    });
  }, [categoryData]);

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

  // Extract common themes/keywords with enhanced filtering and colors
  const commonKeywords = useMemo(() => {
    if (!activeWins.length) return [];
    
    // Combine text ONLY from title and description fields
    let allText = activeWins.map(win => 
      `${win.title || ''} ${win.desc || ''}`
    ).join(' ').toLowerCase();
    
    // Extended stopwords list
    const stopWords = [
      'the', 'and', 'a', 'to', 'in', 'with', 'of', 'for', 'on', 'at', 'from', 'by', 
      'is', 'are', 'was', 'were', 'will', 'would', 'should', 'can', 'could',
      'has', 'have', 'had', 'not', 'be', 'been', 'being', 'as', 'if', 'or',
      'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
      'who', 'whom', 'whose', 'what', 'which', 'when', 'where', 'why', 'how',
      'all', 'any', 'both', 'each', 'few', 'more', 'most', 'some', 'such',
      'no', 'nor', 'too', 'very', 'just', 'but',
      'http', 'https', 'www', 'com', 'net', 'org', 'io', 'html', 'css',
      'google', 'docs', 'doc', 'sheet', 'sheets', 'drive', 'document',
      'tab', 'edit', 'view', 'file', 'folder', 'click', 'email', 'url',
      'link', 'href', 'browser', 'window', 'site', 'page', 'login'
    ];
    
    // Split by non-word characters and filter
    const words = allText.split(/\W+/).filter(word => {
      if (word.length <= 3) return false;
      if (stopWords.includes(word)) return false;
      if (!isNaN(Number(word))) return false;
      if (/^[a-z0-9_-]{10,}$/i.test(word)) return false;
      if (/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(word)) return false;
      return true;
    });
    
    // Count word frequencies
    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    // Colors for word cloud
    const colors = [
      '#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6',
      '#D946EF', '#F97316', '#0EA5E9', '#33C3F0', '#ea384c'
    ];
    
    // Convert to array and sort by frequency
    return Object.entries(wordCounts)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count], index) => ({ 
        word, 
        count,
        color: colors[index % colors.length],
        size: Math.max(0.8, Math.min(1.4, 0.8 + (count / 10) * 0.6)),
        opacity: Math.max(0.6, Math.min(1, 0.6 + (count / 10) * 0.4))
      }));
  }, [activeWins]);

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

  const handleExportDashboard = () => {
    toast({
      title: "Export Initiated",
      description: "Dashboard image export has started",
    });
    // In a real app, we would use html2canvas or similar library to export as PNG
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom domain for z-axis to control bubble size
  const zAxisDomain = [0, Math.max(...categoryData.map(item => item.value)) * 1.2];

  return (
    <PageLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

        {/* Wins by Category Bubble Chart */}
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

        {/* Streak Data */}
        <Card className="lg:col-span-2">
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

        {/* Wins Time Series */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Wins Over Time</CardTitle>
            <p className="text-sm text-muted-foreground">Last 6 months activity</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
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

        {/* Cumulative Wins */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cumulative Wins</CardTitle>
            <p className="text-sm text-muted-foreground">Total progression over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cumulativeWinsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="cumulative" 
                      name="Total Wins" 
                      stroke="#F97316" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Common Themes - Word Cloud */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Common Themes</CardTitle>
            <p className="text-sm text-muted-foreground">Meaningful keywords from titles and descriptions</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {commonKeywords.length > 0 ? (
                commonKeywords.map(({ word, size, opacity, color }) => (
                  <div 
                    key={word}
                    className="px-3 py-1.5 rounded-full text-white"
                    style={{ 
                      fontSize: `${size}rem`,
                      opacity,
                      backgroundColor: color
                    }}
                  >
                    {word}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">No meaningful keywords found</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-4">
          <CardContent className="py-4 flex justify-center">
            <Button onClick={handleExportDashboard}>Export dashboard as PNG</Button>
          </CardContent>
        </Card>
      </div>

      {/* Category Wins Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? `Wins in "${selectedCategory}" (${categoryWins.length})` : 'Category Wins'}
            </DialogTitle>
          </DialogHeader>
          
          {categoryWins.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No wins found in this category.</p>
            </div>
          ) : (
            <div className="space-y-4 p-2">
              {categoryWins.map((win) => (
                <div key={win.id} className="border-b pb-3 last:border-b-0">
                  <h3 className="font-medium text-lg">{win.title}</h3>
                  <div className="flex gap-2 text-sm text-muted-foreground mb-2">
                    <span>{new Date(win.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  {win.desc && <p className="text-sm">{win.desc}</p>}
                  {win.link && (
                    <a 
                      href={win.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      View Details
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default DashboardView;

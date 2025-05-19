import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Star, Archive, ExternalLink, BarChart, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Hard-coded Google Sheets API values
const GOOGLE_SHEETS_API_KEY = 'AIzaSyDsoN29aqbA8yJPVoORiTemvl21ft1zBls';
const GOOGLE_SHEETS_ID = '1zx957CNpMus2IOY17j0TIt5yopSWs1v3AkAf7TSnExw';
const GOOGLE_SHEETS_RANGE = 'Master!A2:G';

interface Win {
  id: string;
  title: string;
  category: string;
  subCategories: string;
  summary: string;
  platform: string;
  date: Date;
  link: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

interface WinsTrackerProps {
  view?: 'table' | 'kanban' | 'calendar' | 'dashboard';
}

export function WinsTracker({ view = 'table' }: WinsTrackerProps) {
  const { toast } = useToast();
  
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState<string[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ preset: 'all', from: null, to: null });
  const [favorites, setFavorites] = useLocalStorage('win-favorites', [] as string[]);
  const [archived, setArchived] = useLocalStorage('win-archived', [] as string[]);
  const [sortBy, setSortBy] = useState({ key: 'date', order: 'desc' });
  const [groupBy, setGroupBy] = useState('none');
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  
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
          const [title, category, subCategories, summary, platform, dateStr, link] = row;
          const id = `win-${index}-${dateStr}`;
          return {
            id,
            title: title || 'Untitled',
            category: category || 'Uncategorized',
            subCategories: subCategories || '',
            summary: summary || '',
            platform: platform || '',
            date: dateStr ? new Date(dateStr) : new Date(),
            link: link || '',
            isFavorite: favorites.includes(id),
            isArchived: archived.includes(id)
          };
        });
        
        setWins(parsedWins);
        toast({
          title: "Data loaded",
          description: `Loaded ${parsedWins.length} wins from Google Sheets.`
        });
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
  
  // Get unique categories for filtering
  const categories = useMemo(() => {
    const allCategories = wins.flatMap(win => 
      win.category.split(',').map(cat => cat.trim())
    );
    return [...new Set(allCategories)].filter(Boolean).sort();
  }, [wins]);
  
  // Get unique subcategories for filtering
  const subCategories = useMemo(() => {
    const allSubCategories = wins.flatMap(win => 
      win.subCategories.split(',').map(subCat => subCat.trim())
    );
    return [...new Set(allSubCategories)].filter(Boolean).sort();
  }, [wins]);
  
  // Get unique platforms for filtering
  const platforms = useMemo(() => {
    return [...new Set(wins.map(win => win.platform))].filter(Boolean).sort();
  }, [wins]);
  
  // Filter wins based on search and filters
  const filteredWins = useMemo(() => {
    return wins.filter(win => {
      // Skip archived items
      if (win.isArchived) return false;
      
      // Text search (case insensitive)
      const searchMatch = !search || 
        `${win.title} ${win.category} ${win.subCategories} ${win.summary} ${win.platform}`.toLowerCase().includes(search.toLowerCase());
      if (!searchMatch) return false;
      
      // Category filter
      const categoryMatch = categoryFilter.length === 0 || 
        win.category.split(',').some(cat => 
          categoryFilter.includes(cat.trim())
        );
      if (!categoryMatch) return false;
      
      // Sub-category filter
      const subCategoryMatch = subCategoryFilter.length === 0 ||
        win.subCategories.split(',').some(subCat => 
          subCategoryFilter.includes(subCat.trim())
        );
      if (!subCategoryMatch) return false;
      
      // Platform filter
      const platformMatch = platformFilter.length === 0 || platformFilter.includes(win.platform);
      if (!platformMatch) return false;
      
      // Date range filter
      if (dateRange.preset !== 'all') {
        const now = new Date();
        let from: Date | null = null;
        let to: Date | null = now;
        
        if (dateRange.preset === 'last7') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          from = sevenDaysAgo;
        } else if (dateRange.preset === 'month') {
          from = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
          from = dateRange.from;
          to = dateRange.to;
        }
        
        if (from && win.date < from) return false;
        if (to && win.date > to) return false;
      }
      
      return true;
    });
  }, [wins, search, categoryFilter, subCategoryFilter, platformFilter, dateRange, archived]);
  
  // Sort wins based on sort criteria
  const sortedWins = useMemo(() => {
    return [...filteredWins].sort((a, b) => {
      if (sortBy.key === 'date') {
        return sortBy.order === 'asc' 
          ? a.date.getTime() - b.date.getTime() 
          : b.date.getTime() - a.date.getTime();
      } else if (sortBy.key === 'title') {
        return sortBy.order === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy.key === 'category') {
        return sortBy.order === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (sortBy.key === 'platform') {
        return sortBy.order === 'asc'
          ? a.platform.localeCompare(b.platform)
          : b.platform.localeCompare(a.platform);
      }
      return 0;
    });
  }, [filteredWins, sortBy]);
  
  // Group wins if grouping is enabled
  const groupedWins = useMemo(() => {
    if (groupBy === 'none') {
      return { ungrouped: sortedWins };
    }
    
    const grouped: Record<string, Win[]> = {};
    
    if (groupBy === 'category') {
      sortedWins.forEach(win => {
        const categories = win.category.split(',').map(c => c.trim());
        categories.forEach(category => {
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(win);
        });
      });
    } else if (groupBy === 'subCategory') {
      sortedWins.forEach(win => {
        const subCategories = win.subCategories.split(',').map(sc => sc.trim());
        if (subCategories.length === 0 || (subCategories.length === 1 && !subCategories[0])) {
          // Handle empty subCategories
          if (!grouped['Uncategorized']) {
            grouped['Uncategorized'] = [];
          }
          grouped['Uncategorized'].push(win);
        } else {
          subCategories.forEach(subCategory => {
            if (!grouped[subCategory]) {
              grouped[subCategory] = [];
            }
            grouped[subCategory].push(win);
          });
        }
      });
    } else if (groupBy === 'platform') {
      sortedWins.forEach(win => {
        const platform = win.platform || 'Unknown';
        if (!grouped[platform]) {
          grouped[platform] = [];
        }
        grouped[platform].push(win);
      });
    } else if (groupBy === 'month') {
      sortedWins.forEach(win => {
        const monthYear = win.date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push(win);
      });
    }
    
    return grouped;
  }, [sortedWins, groupBy]);
  
  // Get recent wins for sidebar
  const recentWins = useMemo(() => {
    return [...wins]
      .filter(win => !win.isArchived)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [wins]);
  
  // Get category breakdown data for chart
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    const activeWins = wins.filter(win => !win.isArchived);
    
    activeWins.forEach(win => {
      win.category.split(',').forEach(category => {
        const cat = category.trim();
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(counts)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [wins]);
  
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
    
    setWins(prev => 
      prev.map(win => 
        win.id === id ? { ...win, isFavorite: !win.isFavorite } : win
      )
    );
  };
  
  const toggleArchive = (id: string) => {
    setArchived(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
    
    setWins(prev => 
      prev.map(win => 
        win.id === id ? { ...win, isArchived: !win.isArchived } : win
      )
    );
  };
  
  const resetFilters = () => {
    setSearch('');
    setCategoryFilter([]);
    setSubCategoryFilter([]);
    setPlatformFilter([]);
    setDateRange({ preset: 'all', from: null, to: null });
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Main content */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wins..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {(categoryFilter.length > 0 || subCategoryFilter.length > 0 || platformFilter.length > 0 || dateRange.preset !== 'all') && (
                  <span className="ml-1 flex h-2 w-2 rounded-full bg-primary"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium">Categories</h4>
                <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={categoryFilter.includes(category) ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        setCategoryFilter(prev => 
                          prev.includes(category) 
                            ? prev.filter(c => c !== category) 
                            : [...prev, category]
                        );
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium">Sub-Categories</h4>
                <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                  {subCategories.map(subCategory => (
                    <Button
                      key={subCategory}
                      variant={subCategoryFilter.includes(subCategory) ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        setSubCategoryFilter(prev => 
                          prev.includes(subCategory) 
                            ? prev.filter(c => c !== subCategory) 
                            : [...prev, subCategory]
                        );
                      }}
                    >
                      {subCategory}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium">Platform</h4>
                <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                  {platforms.map(platform => (
                    <Button
                      key={platform}
                      variant={platformFilter.includes(platform) ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        setPlatformFilter(prev => 
                          prev.includes(platform) 
                            ? prev.filter(p => p !== platform) 
                            : [...prev, platform]
                        );
                      }}
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="mb-2 text-sm font-medium">Date Range</h4>
                <div className="space-y-1">
                  {[
                    { label: 'All time', value: 'all' },
                    { label: 'Last 7 days', value: 'last7' },
                    { label: 'This month', value: 'month' }
                  ].map(option => (
                    <Button 
                      key={option.value}
                      variant={dateRange.preset === option.value ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => setDateRange({ preset: option.value, from: null, to: null })}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <hr className="my-4" />
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                {sortBy.order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                <span>Sort & Group</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => setSortBy({ key: 'date', order: 'desc' })}
              >
                {sortBy.key === 'date' && sortBy.order === 'desc' && <span className="mr-2">✓</span>}
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy({ key: 'date', order: 'asc' })}
              >
                {sortBy.key === 'date' && sortBy.order === 'asc' && <span className="mr-2">✓</span>}
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy({ key: 'title', order: 'asc' })}
              >
                {sortBy.key === 'title' && sortBy.order === 'asc' && <span className="mr-2">✓</span>}
                Title A-Z
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy({ key: 'title', order: 'desc' })}
              >
                {sortBy.key === 'title' && sortBy.order === 'desc' && <span className="mr-2">✓</span>}
                Title Z-A
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy({ key: 'category', order: 'asc' })}
              >
                {sortBy.key === 'category' && sortBy.order === 'asc' && <span className="mr-2">✓</span>}
                Category A-Z
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy({ key: 'platform', order: 'asc' })}
              >
                {sortBy.key === 'platform' && sortBy.order === 'asc' && <span className="mr-2">✓</span>}
                Platform A-Z
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Group By</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setGroupBy('none')}
              >
                {groupBy === 'none' && <span className="mr-2">✓</span>}
                No Grouping
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setGroupBy('category')}
              >
                {groupBy === 'category' && <span className="mr-2">✓</span>}
                Group by Category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setGroupBy('subCategory')}
              >
                {groupBy === 'subCategory' && <span className="mr-2">✓</span>}
                Group by Sub-Category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setGroupBy('platform')}
              >
                {groupBy === 'platform' && <span className="mr-2">✓</span>}
                Group by Platform
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setGroupBy('month')}
              >
                {groupBy === 'month' && <span className="mr-2">✓</span>}
                Group by Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="default" 
            onClick={fetchData} 
            disabled={loading}
            className="ml-auto"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>
        
        {/* Table View */}
        {view === 'table' && (
          <Card>
            <CardContent className="p-0">
              {groupBy === 'none' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Sub-Categories</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedWins.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No wins found. Try adjusting your filters or adding new wins.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedWins.map((win) => (
                        <TableRow key={win.id}>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <a 
                                href={win.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium hover:underline flex items-center gap-1"
                              >
                                {win.title}
                                {win.link && <ExternalLink className="h-3 w-3" />}
                              </a>
                              {win.isFavorite && <Star className="h-3 w-3 text-yellow-500" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {win.category.split(',').map((cat, idx) => (
                                <span 
                                  key={idx} 
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted"
                                >
                                  {cat.trim()}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {win.subCategories.split(',').map((subCat, idx) => (
                                <span 
                                  key={idx} 
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted/60"
                                >
                                  {subCat.trim()}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted/30">
                              {win.platform}
                            </span>
                          </TableCell>
                          <TableCell>
                            {win.date.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setSelectedSummary(win.summary)}
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Summary</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleFavorite(win.id)}
                                    >
                                      <Star className={`h-4 w-4 ${win.isFavorite ? "text-yellow-500 fill-yellow-500" : ""}`} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{win.isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleArchive(win.id)}
                                    >
                                      <Archive className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Archive win</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="divide-y">
                  {Object.entries(groupedWins).map(([group, groupWins]) => (
                    <div key={group}>
                      <div className="p-3 font-medium bg-muted/30">
                        {group}
                      </div>
                      <Table>
                        <TableBody>
                          {groupWins.map((win) => (
                            <TableRow key={win.id}>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <a 
                                    href={win.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="font-medium hover:underline flex items-center gap-1"
                                  >
                                    {win.title}
                                    {win.link && <ExternalLink className="h-3 w-3" />}
                                  </a>
                                  {win.isFavorite && <Star className="h-3 w-3 text-yellow-500" />}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {win.category.split(',').map((cat, idx) => (
                                    <span 
                                      key={idx} 
                                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted"
                                    >
                                      {cat.trim()}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {win.subCategories.split(',').map((subCat, idx) => (
                                    <span 
                                      key={idx} 
                                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted/60"
                                    >
                                      {subCat.trim()}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted/30">
                                  {win.platform}
                                </span>
                              </TableCell>
                              <TableCell>
                                {win.date.toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedSummary(win.summary)}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleFavorite(win.id)}
                                  >
                                    <Star className={`h-4 w-4 ${win.isFavorite ? "text-yellow-500 fill-yellow-500" : ""}`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleArchive(win.id)}
                                  >
                                    <Archive className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Recent Wins */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Wins</CardTitle>
            <p className="text-sm text-muted-foreground">Your latest achievements</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWins.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent wins found.</p>
            ) : (
              recentWins.map(win => (
                <div key={win.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <h3 className="font-medium">{win.title}</h3>
                  <div className="flex gap-2 text-sm text-muted-foreground mb-1">
                    <span>{win.category.split(',')[0]}</span>
                    <span>•</span>
                    <span>{win.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  {win.summary && (
                    <p className="text-sm line-clamp-2">{win.summary}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
        
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Distribution of your wins</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoryBreakdown.map(({ category, count, percentage }) => (
                <div key={category}>
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span>{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Summary Dialog */}
      <AlertDialog open={!!selectedSummary} onOpenChange={() => setSelectedSummary(null)}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Win Summary</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="whitespace-pre-line text-base text-foreground">
            {selectedSummary}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

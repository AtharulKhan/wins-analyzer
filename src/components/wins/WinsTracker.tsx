
import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Star, Archive, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
} from "@/components/ui/dropdown-menu";

interface Win {
  id: string;
  title: string;
  category: string;
  date: Date;
  link: string;
  desc: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

interface WinsTrackerProps {
  view?: 'table' | 'kanban' | 'calendar' | 'dashboard';
}

export function WinsTracker({ view = 'table' }: WinsTrackerProps) {
  const { toast } = useToast();
  const [apiKey] = useLocalStorage('google-sheets-api-key', '');
  const [sheetId] = useLocalStorage('google-sheets-id', '1zx957CNpMus2IOY17j0TIt5yopSWs1v3AkAf7TSnExw');
  const [range] = useLocalStorage('google-sheets-range', 'Master!A2:E');
  
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ preset: 'all', from: null, to: null });
  const [favorites, setFavorites] = useLocalStorage('win-favorites', [] as string[]);
  const [archived, setArchived] = useLocalStorage('win-archived', [] as string[]);
  
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
          variant: "warning"
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
  
  // Get unique categories for filtering
  const categories = useMemo(() => {
    const allCategories = wins.flatMap(win => 
      win.category.split(',').map(cat => cat.trim())
    );
    return [...new Set(allCategories)].filter(Boolean).sort();
  }, [wins]);
  
  // Filter wins based on search and filters
  const filteredWins = useMemo(() => {
    return wins.filter(win => {
      // Skip archived items
      if (win.isArchived) return false;
      
      // Text search (case insensitive)
      const searchMatch = !search || 
        `${win.title} ${win.category} ${win.desc}`.toLowerCase().includes(search.toLowerCase());
      if (!searchMatch) return false;
      
      // Category filter
      const categoryMatch = categoryFilter.length === 0 || 
        win.category.split(',').some(cat => 
          categoryFilter.includes(cat.trim())
        );
      if (!categoryMatch) return false;
      
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
  }, [wins, search, categoryFilter, dateRange, archived]);
  
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
    setDateRange({ preset: 'all', from: null, to: null });
  };
  
  return (
    <div className="space-y-4">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              {(categoryFilter.length > 0 || dateRange.preset !== 'all') && (
                <span className="ml-1 flex h-2 w-2 rounded-full bg-primary"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-4" align="start">
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium">Categories</h4>
              <div className="flex flex-wrap gap-1">
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
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="default" 
          onClick={fetchData} 
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>
      
      {/* Table View */}
      {view === 'table' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No wins found. Try adjusting your filters or adding new wins.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWins.map((win) => (
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
                        {win.desc && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                            {win.desc}
                          </p>
                        )}
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
                        {win.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(win.id)}
                            title={win.isFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Star className={`h-4 w-4 ${win.isFavorite ? "text-yellow-500 fill-yellow-500" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleArchive(win.id)}
                            title="Archive win"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
